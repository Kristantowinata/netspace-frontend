"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminIndexPage() {
  const router = useRouter();
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/admin/analytics");
    } else {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
    }}>
      <div style={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        border: "3px solid rgba(79, 110, 255, 0.3)",
        borderTopColor: "#4F6EFF",
        animation: "spin 0.8s linear infinite",
      }} />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
