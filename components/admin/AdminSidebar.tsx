"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/store/useAdminStore";
import { getActiveUsers } from "@/services/adminApi";
import { adminWsClient } from "@/lib/ws";

interface AdminSidebarProps {
  location: string;
  locationName: string;
  locationAvatar: string;
}

export default function AdminSidebar({ location, locationName, locationAvatar }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAdminStore((s) => s.logout);
  const adminName = useAdminStore((s) => s.adminName);
  const adminRole = useAdminStore((s) => s.adminRole);
  const adminAvatar = useAdminStore((s) => s.adminAvatar);

  const [activeUsersCount, setActiveUsersCount] = useState<number | null>(null);

  useEffect(() => {
    getActiveUsers(location).then((data) => {
      setActiveUsersCount(data.length);
    }).catch(() => {});

    const interval = setInterval(() => {
      getActiveUsers(location).then((data) => {
        setActiveUsersCount(data.length);
      }).catch(() => {});
    }, 15000);

    return () => clearInterval(interval);
  }, [location]);

  const NAV_ITEMS = [
    {
      href: `/${location}/admin/analytics`,
      label: "Analytics",
      icon: (
        <svg className="w-[18px] h-[18px] transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      )
    },
    {
      href: `/${location}/admin/lokasi`,
      label: "Lokasi & QR",
      icon: (
        <svg className="w-[18px] h-[18px] transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <rect x="7" y="7" width="3" height="3" />
          <rect x="14" y="7" width="3" height="3" />
          <rect x="7" y="14" width="3" height="3" />
          <path d="M14 14h3v3h-3z" />
        </svg>
      )
    },
    {
      href: `/${location}/admin/users`,
      label: "Users Aktif",
      icon: (
        <svg className="w-[18px] h-[18px] transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      href: `/${location}/admin/public-chat`,
      label: "Public Chat",
      icon: (
        <svg className="w-[18px] h-[18px] transition-colors duration-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          <path d="M8 9h8M8 13h5" />
        </svg>
      )
    },
  ];

  const handleLogout = () => {
    adminWsClient.disconnect();
    logout();
    router.push(`/${location}/admin/login`);
  };

  return (
    <aside className="sticky top-0 h-screen w-[260px] min-w-[260px] max-[1100px]:w-[220px] max-[1100px]:min-w-[220px] flex flex-col px-4 py-6 bg-[linear-gradient(180deg,rgba(10,15,34,0.95)_0%,rgba(8,12,28,0.98)_100%)] backdrop-blur-[30px] border-r border-white/5 shadow-[inset_-1px_0_0_rgba(255,255,255,0.02),8px_0_32px_rgba(0,0,0,0.3)] z-20">
      {/* Platform Branding */}
      <div className="flex items-center gap-2.5 px-2 py-1 mb-4">
        <div className="w-8 h-8 rounded-lg bg-admin-primary/[0.08] border border-admin-primary/20 flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(79,110,255,0.15)]">
          <svg className="w-5 h-5" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="url(#logoGrad)" strokeWidth="2.5" />
            <path d="M12 7L16 12L12 17L8 12Z" fill="url(#logoGrad)" />
            <defs>
              <linearGradient id="logoGrad" x1="4" y1="4" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F6EFF" />
                <stop offset="1" stopColor="#7aa8ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="flex flex-col gap-px">
          <span className="text-[13.5px] font-extrabold text-white tracking-[0.15em] leading-tight">NETSPACE</span>
          <span className="text-[9px] font-bold text-admin-accent tracking-[0.08em]">PORTAL PARTNER</span>
        </div>
      </div>

      {/* Location Card */}
      <div className="flex items-center gap-2.5 py-2.5 px-3 mx-1 mb-[18px] bg-white/[0.025] border border-white/5 rounded-[10px] transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.08]">
        <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[15px] shrink-0">
          {locationAvatar}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[12.5px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis" title={locationName}>
            {locationName}
          </span>
          <span className="flex items-center gap-[5px] text-[10.5px] text-admin-text-muted">
            <span className="w-[5px] h-[5px] rounded-full bg-admin-success shadow-[0_0_6px_var(--color-admin-success)]" />
            Online
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06)_10%,rgba(255,255,255,0.06)_90%,transparent)] mx-1 mb-3.5" />

      {/* Label */}
      <span className="text-[9px] font-extrabold tracking-[0.12em] text-white/[0.25] px-2.5 mb-2">NAVIGASI UTAMA</span>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const isUsersPage = item.label === "Users Aktif";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 py-2.5 px-3 rounded-lg text-[13.5px] font-medium no-underline overflow-hidden transition-all duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:rounded-r-[3px] before:bg-admin-primary before:transition-all before:duration-[250ms] before:ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isActive
                  ? "text-white bg-[linear-gradient(90deg,rgba(79,110,255,0.15)_0%,rgba(79,110,255,0.03)_100%)] border border-admin-primary/25 font-semibold before:h-[18px] before:opacity-100 before:shadow-[0_0_8px_rgba(79,110,255,0.8)] [&_svg]:text-admin-accent [&_svg]:drop-shadow-[0_0_4px_rgba(122,168,255,0.4)]"
                  : "text-white/60 border border-transparent before:h-3.5 before:opacity-0 before:scale-y-[0.4] hover:text-white hover:bg-white/[0.03] hover:border-white/5 hover:translate-x-1 [&:hover_svg]:text-white"
              }`}
            >
              <span className="flex items-center justify-center w-5 h-5 shrink-0">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
              {isUsersPage && activeUsersCount !== null && (
                <span className="ml-auto text-[11px] font-bold bg-admin-success/[0.12] text-admin-success px-[7px] py-0.5 rounded-md border border-admin-success/20 animate-badge-pulse">
                  {activeUsersCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div>
        <div className="h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06)_10%,rgba(255,255,255,0.06)_90%,transparent)] mx-1 mb-4" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 px-2 py-1 mb-3">
          <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,rgba(79,110,255,0.2),rgba(122,80,255,0.15))] border border-white/10 flex items-center justify-center text-[15px] shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
            {adminAvatar || "🧑‍💼"}
          </div>
          <div className="flex flex-col gap-px min-w-0">
            <span className="text-[12.5px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis" title={adminName || "Admin"}>
              {adminName || "Admin"}
            </span>
            <span className="text-[10.5px] text-admin-text-muted">
              {adminRole || "Partner"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-lg text-[13px] font-medium font-[inherit] text-red-400/85 bg-transparent border border-transparent cursor-pointer transition-all duration-200 hover:bg-red-400/[0.06] hover:border-red-400/15 hover:text-admin-danger hover:translate-x-1"
          onClick={handleLogout}
        >
          <span className="flex items-center justify-center w-5 h-5 shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="whitespace-nowrap">Logout</span>
        </button>
      </div>
    </aside>
  );
}
