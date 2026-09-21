"use client";

import { useEffect, useState } from "react";
import SaaSLandingPage from "./landing/page";
import DashboardPage from "./(dashboard)/page";
import DashboardLayout from "./(dashboard)/layout";

export default function RootHomePage() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem("yt_user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user string", e);
      }
    }
  }, []);

  if (!mounted) return null;

  // If user is logged in, render Dashboard with Layout directly on /
  if (user) {
    return (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    );
  }

  // If visitor is guest, render Public SaaS Landing Page
  return <SaaSLandingPage />;
}
