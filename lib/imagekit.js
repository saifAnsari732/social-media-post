import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey:
    process.env.IMAGEKIT_PUBLIC_KEY ||
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    "public_zA/OEOHQn+iEQFNIGyzHV7g3e+s=",
  privateKey:
    process.env.IMAGEKIT_PRIVATE_KEY ||
    "private_P/VswEdAMxmdciTFQVqqOCn8qMk=",
  urlEndpoint:
    process.env.IMAGEKIT_URL_ENDPOINT ||
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    "https://ik.imagekit.io/saifdeveloper"
});

export function formatImageKitUrl(url, isVideo = false) {
  if (!url || typeof url !== "string") return url;
  const isVid = isVideo || Boolean(url.match(/\.(mp4|mov|webm|avi|m4v|mkv|3gp)(\?|$)/i)) || url.includes("/videos/");
  if (isVid && url.includes("ik.imagekit.io") && !url.includes("tr:orig-true")) {
    return url.replace(/(ik\.imagekit\.io\/[^/]+)\//, "$1/tr:orig-true/");
  }
  return url;
}

export default imagekit;
