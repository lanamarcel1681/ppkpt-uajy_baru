"use client";

import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar open={sidebarOpen} />
      
      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 w-full min-w-0
          ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}
      >
        <Topbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}