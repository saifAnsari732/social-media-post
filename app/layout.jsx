import "./globals.css";

export const metadata = {
  title: "Broadcast — One Video, Every Channel",
  description: "Connect your social channels and publish everywhere at once."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
