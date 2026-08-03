import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "yt-post — One Video, Every Channel",
  description: "yt-post is an application that allows users to securely connect their social media accounts and publish video content directly to their YouTube channels and other platforms.",
  verification: {
    google: "PGNbKPaL5LatP1QDJc73lVa9CPnWeAO5AebFE1xIsm0",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
