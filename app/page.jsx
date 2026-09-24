"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SaaSLandingPage from "@/components/landing/SaaSLandingPage";

export default function RootHomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("socialflow_user") || localStorage.getItem("yt_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u && u.userId) {
          router.replace("/dashboard");
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <SaaSLandingPage />;
}
