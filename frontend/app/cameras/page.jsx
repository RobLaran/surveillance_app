"use client";

import { useState } from "react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { CameraCard } from "@/features/dashboard/components/camera-card";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCameras, Camera } from "@/hooks/use-cameras";
// import { cameras } from "@/lib/mock-data";
import { Search, Grid3X3, LayoutGrid, Video, RefreshCw } from "lucide-react";

export default function CamerasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gridSize, setGridSize] = useState("normal");
  const { cameras } = useCameras();

  const filteredCameras = cameras.filter((camera) => {
    const matchesSearch = camera.cameraName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "online" && camera.status === "online") ||
      (statusFilter === "offline" && camera.status === "offline");
    return matchesSearch && matchesStatus;
  });

  const onlineCameras = cameras.filter((c) => c.status === "online").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Live Cameras</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {onlineCameras} of {cameras.length} cameras online
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-1 border border-border rounded-lg p-1">
            <Button
              variant={gridSize === "normal" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setGridSize("normal")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={gridSize === "compact" ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={() => setGridSize("compact")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Camera Grid */}
        <div
          className={`grid gap-4 ${
            gridSize === "compact"
              ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          }`}
        >
          {filteredCameras.map((camera) => (
            <CameraCard key={camera.cameraId} camera={camera} />
          ))}
        </div>

        {filteredCameras.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-2">No cameras found</CardTitle>
              <CardDescription>
                {searchQuery || statusFilter !== "all"
                  ? "No cameras match your filter criteria"
                  : "No cameras configured yet"}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
