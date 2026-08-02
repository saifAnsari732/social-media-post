import "./globals.css";

export const metadata = {
  title: "yt-post — One Video, Every Channel",
  description: "yt-post is an application that allows users to securely connect their social media accounts and publish video content directly to their YouTube channels and other platforms."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
