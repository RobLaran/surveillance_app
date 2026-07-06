"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function DashboardLayout({ children }) {
  const [ sidebarCollapsed, setSidebarCollapsed ] = useState(false);
  const [ mobileMenuOpen, setMobileMenuOpen ] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64" title="Sidebar Nav" aria-describedby={undefined}>
          <Sidebar 
            collapsed={false} 
            onToggle={() => setMobileMenuOpen(false)} 
          />
        </SheetContent>
      </Sheet>

      <div 
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <TopNavbar 
          onMenuClick={() => setMobileMenuOpen(true)}
          alertCount={3}
        />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}