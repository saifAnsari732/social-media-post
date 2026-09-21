"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SaaSLandingPage from "./landing/page";

export default function RootHomePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        // Clean client navigation to dashboard without cross-importing page files
        window.location.href = "/publisher";
      } catch (e) {
        console.error("Failed to parse user string", e);
      }
    }
  }, [router]);

  if (!mounted || user) return null;

  return <SaaSLandingPage />;
}
