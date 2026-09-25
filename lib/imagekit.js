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

export default imagekit;
