"use client";

import { useState } from "react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { recordings, cameras } from "@/lib/mock-data";
import { 
  Search, 
  Download, 
  Play, 
  Clock, 
  HardDrive, 
  Video, 
  Calendar,
  PlayCircle,
  X,
  AlertTriangle,
  User,
  Move
} from "lucide-react";
import { cn } from "@/lib/utils";

const triggerIcons = {
  Motion: Move,
  "Face Detected": User,
  "Unknown Person": AlertTriangle,
};

const triggerColors = {
  Motion: "bg-amber-500/10 text-amber-500",
  "Face Detected": "bg-primary/10 text-primary",
  "Unknown Person": "bg-red-500/10 text-red-500",
};

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function RecordingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cameraFilter, setCameraFilter] = useState("all");
  const [selectedRecording, setSelectedRecording] = useState(null);

  const filteredRecordings = recordings.filter((recording) => {
    const matchesSearch = recording.camera
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCamera =
      cameraFilter === "all" || recording.camera === cameraFilter;
    return matchesSearch && matchesCamera;
  });

  const totalSize = recordings.reduce((acc, r) => {
    const size = parseFloat(r.size);
    return acc + size;
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recordings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and download motion-triggered recordings
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{recordings.length}</p>
                  <p className="text-sm text-muted-foreground">Total Clips</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <HardDrive className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{totalSize.toFixed(1)} MB</p>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {recordings.filter(r => r.trigger === "Motion").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Motion Triggered</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search recordings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={cameraFilter} onValueChange={setCameraFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Camera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cameras</SelectItem>
              {cameras.map((camera) => (
                <SelectItem key={camera.id} value={camera.name}>
                  {camera.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Recordings Grid */}
        {filteredRecordings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRecordings.map((recording) => {
              const TriggerIcon = triggerIcons[recording.trigger] || Move;
              return (
                <Card 
                  key={recording.id} 
                  className="group border-border overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRecording(recording)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                      <Video className="h-10 w-10 text-zinc-600" />
                    </div>
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-mono">
                      {recording.duration}
                    </div>
                    {/* Trigger badge */}
                    <Badge 
                      variant="secondary" 
                      className={cn("absolute top-2 left-2 gap-1", triggerColors[recording.trigger])}
                    >
                      <TriggerIcon className="h-3 w-3" />
                      {recording.trigger}
                    </Badge>
                  </div>

                  {/* Info */}
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-foreground">{recording.camera}</h3>
                      <span className="text-xs text-muted-foreground">{recording.size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(recording.timestamp)}</span>
                      <span>•</span>
                      <span>{formatTime(recording.timestamp)}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-2">No recordings found</CardTitle>
              <CardDescription>
                No recordings match your filter criteria
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {/* Playback Modal */}
        <Dialog open={!!selectedRecording} onOpenChange={() => setSelectedRecording(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedRecording?.camera} - Recording</span>
                <Badge variant="secondary">
                  {selectedRecording?.trigger}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Video Player Placeholder */}
              <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <PlayCircle className="h-16 w-16 text-zinc-600" />
                  <p className="text-sm text-muted-foreground">Video playback would appear here</p>
                </div>
              </div>

              {/* Recording Details */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Duration:</span>
                    <span className="text-foreground font-mono">{selectedRecording?.duration}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <HardDrive className="h-4 w-4" />
                    <span>Size:</span>
                    <span className="text-foreground">{selectedRecording?.size}</span>
                  </div>
                </div>
                <Button size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
