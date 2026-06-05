"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

interface LayoutShellProps {
  children: React.ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="w-full max-w-md mx-auto min-h-screen flex flex-col relative bg-slate-50 dark:bg-slate-950 shadow-2xl border-x border-slate-200 dark:border-slate-800">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col min-w-0 pb-16">
        <Header onMenuToggle={toggleSidebar} hideMenuButton={true} />
        <main className="flex-1 p-4 flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
      <BottomNav onMenuToggle={toggleSidebar} />
    </div>
  );
}
