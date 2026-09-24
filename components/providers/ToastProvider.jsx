"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#0f172a",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "600",
          borderRadius: "12px",
          padding: "12px 16px",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.25)",
          zIndex: 999999
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff"
          }
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff"
          }
        }
      }}
    />
  );
}
