"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
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

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-shell__main">
        <AdminTopbar />
        <main className="admin-shell__content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .admin-shell {
          display: grid;
          grid-template-columns: var(--admin-sidebar-width, 248px) 1fr;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        .admin-shell__main {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .admin-shell__content {
          flex: 1;
          padding: 28px 32px 40px;
        }

        @media (max-width: 1100px) {
          .admin-shell {
            grid-template-columns: 200px 1fr;
          }
        }
      `}</style>
    </div>
  );
}
