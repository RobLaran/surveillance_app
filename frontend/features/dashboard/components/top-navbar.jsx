"use client";

import { useState, useEffect, useMemo } from "react";
import { Bell, Wifi, WifiOff, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function TopNavbar({ onMenuClick, alertCount = 3 }) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [systemOnline, setSystemOnline] = useState(true);
    const [currentTime, setCurrentTime] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Ensure hydration safety
    useEffect(() => {
        setMounted(true);
    }, []);

    // System online/offline (browser-only state)
    useEffect(() => {
        const updateStatus = () => setSystemOnline(navigator.onLine);

        updateStatus();

        window.addEventListener("online", updateStatus);
        window.addEventListener("offline", updateStatus);

        return () => {
            window.removeEventListener("online", updateStatus);
            window.removeEventListener("offline", updateStatus);
        };
    }, []);

    // Clock
    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date());

        updateTime();

        const timer = setInterval(updateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    const initials = useMemo(() => {
        if (!user?.firstName || !user?.lastName) return "AG";
        return `${user.firstName[0]}${user.lastName[0]}`;
    }, [user]);

    async function handleLogout() {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await logout();
        } finally {
            router.replace("/sign-in");
            setIsLoggingOut(false);
        }
    }

    const formatDate = (timestamp) =>
        new Date(timestamp).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });

    const formatTime = (timestamp) =>
        new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

    if (!mounted) return null;

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
            {/* Left */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-muted-foreground"
                    onClick={onMenuClick}
                >
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden sm:flex flex-col">
                    <span className="text-xs text-muted-foreground">
                        {currentTime && formatDate(currentTime)}
                    </span>
                    <span className="text-lg font-mono font-semibold tracking-wider">
                        {currentTime && formatTime(currentTime)}
                    </span>
                </div>
            </div>

            {/* Center */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50">
                {systemOnline ? (
                    <>
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">
                            System Online
                        </span>
                    </>
                ) : (
                    <>
                        <WifiOff className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">
                            System Offline
                        </span>
                    </>
                )}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative"
                        >
                            <Bell className="h-5 w-5" />
                            {alertCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 p-0 text-[10px]"
                                >
                                    {alertCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-72">
                        <DropdownMenuLabel>Recent Alerts</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="flex flex-col items-start">
                            <span className="text-sm font-medium">
                                Unknown person detected
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Front Door - 5 min ago
                            </span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex flex-col items-start">
                            <span className="text-sm font-medium">
                                Motion detected
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Garage - 12 min ago
                            </span>
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex flex-col items-start">
                            <span className="text-sm font-medium">
                                Camera offline
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Living Room - 45 min ago
                            </span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src={user?.avatarUrl || undefined}
                                    alt={
                                        user
                                            ? `${user.firstName} ${user.lastName}`
                                            : "User avatar"
                                    }
                                />

                                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span>
                                    {isLoading
                                        ? "Loading..."
                                        : user
                                          ? `${user.firstName} ${user.lastName}`
                                          : "Guest"}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    {isLoading ? "" : user?.email}
                                </span>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            className="text-destructive"
                            disabled={isLoggingOut}
                            onClick={handleLogout}
                        >
                            {isLoggingOut ? "Logging out..." : "Log out"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
