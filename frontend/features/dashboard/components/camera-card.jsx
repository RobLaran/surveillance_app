"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Maximize2, 
  Video, 
  VideoOff, 
  Cpu,
  AlertTriangle,
  User,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL

export function CameraCard({ camera }) {
  const [fullscreen, setFullscreen] = useState(false);

  const isOnline = camera.status === "online";
  const hasUnknownPerson = camera.detections?.some(d => d.label === "Unknown");

  return (
    <div>
      <div 
        className={cn(
          "group relative overflow-hidden rounded-xl border transition-all duration-300",
          "bg-card hover:border-primary/50",
          !isOnline && "opacity-60"
        )}
      >
        {/* Camera Feed */}
        <div className="relative w-full aspect-video bg-zinc-900 overflow-hidden">
          {isOnline ? (
            <>
              <img
                src={`${API_URL}/video/${camera.id}`}
                alt={camera.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Camera name watermark */}
              <div className="absolute bottom-2 left-2 text-xs text-white/60 font-mono">
                {camera.name.toUpperCase()} • CH{camera.id}
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <VideoOff className="h-12 w-12 text-zinc-600" />
              <span className="text-sm text-zinc-500">Camera Offline</span>
            </div>
          )}

          {/* Top overlay badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
            {camera.recording && (
              <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0.5">
                <Circle className="h-2 w-2 fill-current animate-recording" />
                REC
              </Badge>
            )}
            {camera.motionDetected && isOnline && (
              <Badge className="gap-1 text-[10px] px-1.5 py-0.5 bg-amber-500/90 text-black hover:bg-amber-500">
                <AlertTriangle className="h-3 w-3" />
                MOTION
              </Badge>
            )}
            {hasUnknownPerson && (
              <Badge variant="destructive" className="gap-1 text-[10px] px-1.5 py-0.5">
                <User className="h-3 w-3" />
                UNKNOWN
              </Badge>
            )}
          </div>

          {/* Fullscreen button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Camera Info */}
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">{camera.name}</h3>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "h-2 w-2 rounded-full",
                isOnline ? "bg-green-500" : "bg-red-500"
              )} />
              <span className={cn(
                "text-xs",
                isOnline ? "text-green-500" : "text-red-500"
              )}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{camera.location}</span>
            <div className="flex items-center gap-2">
              {camera.aiEnabled && (
                <span className="flex items-center gap-1 text-primary">
                  <Cpu className="h-3 w-3" />
                  AI
                </span>
              )}
              {isOnline && (
                <span className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  Live
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent className="max-w-4xl sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {camera.name}
              <Badge variant={isOnline ? "default" : "destructive"} className="ml-2">
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            {isOnline ? (
              <>
                {/* Camera feed */}
                <img
                  src={`${API_URL}/video/${camera.id}`}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <VideoOff className="h-16 w-16 text-zinc-600" />
                <span className="text-zinc-500">Camera Offline</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}