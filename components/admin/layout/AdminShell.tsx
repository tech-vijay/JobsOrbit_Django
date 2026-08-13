"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminShellProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export default function AdminShell({ children, user }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      {/* Sidebar for Desktop & Mobile Drawer */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 lg:pl-64 transition-all duration-300">
        <AdminHeader
          user={user}
          onMenuToggle={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
