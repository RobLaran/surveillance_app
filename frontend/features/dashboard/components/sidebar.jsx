"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Video,
    User,
    UserPlus,
    FileText,
    PlayCircle,
    Camera,
    Settings,
    Bell,
    Shield,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Live Cameras", href: "/cameras", icon: Video },
    { name: "Face Enrollment", href: "/enrollment", icon: UserPlus },
    { name: "Event Logs", href: "/events", icon: FileText },
    { name: "Recordings", href: "/recordings", icon: PlayCircle },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Camera Management", href: "/management", icon: Camera },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300",
                collapsed ? "w-16" : "w-64",
            )}
        >
            {/* Logo */}
            <Logo isCollapsed={collapsed} isGreen showBottomBorder />

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                                collapsed && "justify-center px-2",
                            )}
                            title={collapsed ? item.name : undefined}
                        >
                            <item.icon
                                className={cn(
                                    "h-5 w-5 shrink-0",
                                    isActive && "text-primary",
                                )}
                            />
                            {!collapsed && <span>{item.name}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="border-t border-border p-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggle}
                    className={cn(
                        "w-full justify-center text-muted-foreground hover:text-foreground",
                        !collapsed && "justify-start",
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span>Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}
