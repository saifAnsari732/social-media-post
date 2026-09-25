import { NextResponse } from "next/server";
import imagekit from "@/lib/imagekit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return NextResponse.json({
      ...authParams,
      publicKey:
        process.env.IMAGEKIT_PUBLIC_KEY ||
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
        "public_zA/OEOHQn+iEQFNIGyzHV7g3e+s=",
      urlEndpoint:
        process.env.IMAGEKIT_URL_ENDPOINT ||
        process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
        "https://ik.imagekit.io/saifdeveloper"
    });
  } catch (error) {
    console.error("Error generating ImageKit auth parameters:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate auth parameters" },
      { status: 500 }
    );
  }
}
