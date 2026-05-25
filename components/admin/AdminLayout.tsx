"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { getLocationInfo } from "@/services/adminMockData";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const params = useParams();
  const location = params.location as string;
  const isAuthenticated = useAdminStore((s) => s.isAuthenticated);
  const locInfo = getLocationInfo(location);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${location}/admin/login`);
    }
  }, [isAuthenticated, router, location]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 rounded-full border-[3px] border-admin-primary/30 border-t-admin-primary animate-admin-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[260px_1fr] min-h-screen relative z-[1] max-[1100px]:grid-cols-[220px_1fr]">
      <AdminSidebar
        location={location}
        locationName={locInfo.name}
        locationAvatar={locInfo.avatar}
      />
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <AdminTopbar
          locationName={locInfo.name}
          locationAvatar={locInfo.avatar}
        />
        <main className="flex-1 py-7 px-9 pb-12 max-[1100px]:px-5 max-[1100px]:py-6 max-[1100px]:pb-9">
          {children}
        </main>
      </div>
    </div>
  );
}
