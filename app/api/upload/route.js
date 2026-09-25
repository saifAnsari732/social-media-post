import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let fileBuffer = null;
    let fileName = `upload_${Date.now()}`;
    let mimeType = "image/png";
    let isVideo = false;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      if (!body.base64 && !body.file) {
        return NextResponse.json({ error: "No base64 file provided" }, { status: 400 });
      }
      const rawBase64 = body.base64 || body.file;
      fileName = body.fileName || fileName;
      
      // Check data URI mime type
      if (rawBase64.startsWith("data:")) {
        const matches = rawBase64.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          const base64Data = matches[2];
          fileBuffer = Buffer.from(base64Data, "base64");
        } else {
          fileBuffer = Buffer.from(rawBase64.replace(/^data:[^;]+;base64,/, ""), "base64");
        }
      } else {
        fileBuffer = Buffer.from(rawBase64, "base64");
      }
    } else {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || typeof file !== "object" || file.size === 0) {
        return NextResponse.json({ error: "No valid file uploaded" }, { status: 400 });
      }

      fileName = file.name || fileName;
      mimeType = file.type || mimeType;
      const arrayBuf = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuf);
    }

    isVideo =
      mimeType.startsWith("video/") ||
      Boolean(fileName.match(/\.(mp4|mov|webm|avi|m4v|mkv|3gp)$/i));

    const folderPath = isVideo ? "/social_posts/videos" : "/social_posts/images";

    const uploadResponse = await new Promise((resolve, reject) => {
      imagekit.upload(
        {
          file: fileBuffer,
          fileName: fileName.replace(/[^a-zA-Z0-9_.-]/g, "_"),
          folder: folderPath,
          useUniqueFileName: true,
          tags: [isVideo ? "video" : "image", "social_media_agent"]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    const finalMediaType = isVideo ? "video" : "image";

    return NextResponse.json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      mediaType: finalMediaType,
      size: uploadResponse.size,
      height: uploadResponse.height,
      width: uploadResponse.width,
      thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url
    });
  } catch (error) {
    console.error("ImageKit upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload file to ImageKit" },
      { status: 500 }
    );
  }
}
