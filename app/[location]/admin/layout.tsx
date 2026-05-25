import type { Metadata } from "next";
import "./admin-globals.css";

export const metadata: Metadata = {
  title: "NetSpace Admin",
  description: "Admin Dashboard untuk mengelola lokasi dan user NetSpace",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      {children}
    </div>
  );
}
