"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminMobileSidebar } from "@/components/admin/admin-mobile-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

interface AdminShellProps {
  fullName: string | null;
  email: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}

export function AdminShell({ fullName, email, avatarUrl, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-theme flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <AdminMobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AdminTopbar
          fullName={fullName}
          email={email}
          avatarUrl={avatarUrl}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
