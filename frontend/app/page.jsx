"use client";

import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { CameraCard } from "@/features/dashboard/components/camera-card";
import { AlertCard } from "@/features/dashboard/components/alert-card";
import { EventTable } from "@/features/dashboard/components/event-table";
import { QuickControls } from "@/features/dashboard/components/quick-controls";
import { StatsCard } from "@/features/dashboard/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cameras, recentAlerts, eventLogs, systemStats } from "@/lib/mock-data";
import {
    Camera,
    Video,
    HardDrive,
    Bell,
    Users,
    Clock,
    ChevronRight,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Real-time surveillance monitoring and AI detection
                        </p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Refresh
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatsCard
                        title="Total Cameras"
                        value={`${systemStats.onlineCameras}/${systemStats.totalCameras}`}
                        subtitle="cameras online"
                        icon={Camera}
                    />
                    <StatsCard
                        title="Recordings Today"
                        value={systemStats.totalRecordings}
                        trend="12%"
                        trendUp={true}
                        icon={Video}
                    />
                    <StatsCard
                        title="Storage Used"
                        value={systemStats.storageUsed}
                        subtitle={`of ${systemStats.storageTotal}`}
                        icon={HardDrive}
                    />
                    <StatsCard
                        title="Alerts Today"
                        value={systemStats.alertsToday}
                        trend="3"
                        trendUp={false}
                        icon={Bell}
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Camera Grid - Takes 2 columns */}
                    <div className="xl:col-span-2 space-y-4">
                        <Card className="border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    Live Cameras
                                </CardTitle>
                                <Link href="/cameras">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 text-muted-foreground hover:text-foreground"
                                    >
                                        View All
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {cameras.map((camera) => (
                                        <CameraCard
                                            key={camera.id}
                                            camera={camera}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Events */}
                        <Card className="border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    Recent Events
                                </CardTitle>
                                <Link href="/events">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 text-muted-foreground hover:text-foreground"
                                    >
                                        View All
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <EventTable events={eventLogs} compact />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side Panel */}
                    <div className="space-y-4">
                        {/* Recent Alerts */}
                        <Card className="border-border bg-card">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    Recent Alerts
                                </CardTitle>
                                <Link href="/notifications">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1 text-muted-foreground hover:text-foreground"
                                    >
                                        View All
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="h-[280px] pr-4">
                                    <div className="space-y-2">
                                        {recentAlerts.map((alert) => (
                                            <AlertCard
                                                key={alert.id}
                                                alert={alert}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Quick Controls */}
                        <Card className="border-border bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    Quick Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <QuickControls />
                            </CardContent>
                        </Card>

                        {/* System Info */}
                        <Card className="border-border bg-card">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold">
                                    System Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            Enrolled Faces
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {systemStats.facesEnrolled}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            System Uptime
                                        </div>
                                        <span className="text-sm font-medium text-foreground font-mono">
                                            {systemStats.uptime}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <HardDrive className="h-4 w-4" />
                                            Storage
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {systemStats.storageUsed} /{" "}
                                            {systemStats.storageTotal}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
