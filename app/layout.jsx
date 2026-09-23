import "./globals.css";

export const metadata = {
  title: "Postfly — AI Social Media Automation & Publisher",
  description: "Schedule, publish, and automate your social media content across Instagram, Facebook, and YouTube with AI.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "PGNbKPaL5LatP1QDJc73lVa9CPnWeAO5AebFE1xIsm0",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-[#F8FAFC] min-h-screen">
        {children}
      </body>
    </html>
  );
}
