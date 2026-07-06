"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ThumbnailImage } from "@/components/ui/thumbnail-image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Wifi, WifiOff, Link, Edit } from "lucide-react";
import { Camera } from "@/hooks/use-cameras";

interface CameraCardProps {
  camera: Camera;
  onEdit: (camera: Camera) => void;
  onDelete: (cameraId: number) => void;
  onToggleAI: (cameraId: number, current: boolean) => void;
  onToggleRecording: (cameraId: number, current: boolean) => void;
}

export function CameraCard({
  camera,
  onEdit,
  onDelete,
  onToggleAI,
  onToggleRecording,
}: CameraCardProps) {
  return (
    <Card className="border-border">
      <CardContent className="p-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4">

          {/* Thumbnail */}
          <div className="relative w-full lg:w-48 aspect-video lg:aspect-[4/3] bg-zinc-900 rounded-lg overflow-hidden shrink-0">
            {camera.status === "online" ? (
              <ThumbnailImage cameraId={camera.cameraId} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <WifiOff className="h-8 w-8 text-zinc-600" />
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge
                variant={camera.status === "online" ? "default" : "destructive"}
                className="text-[10px]"
              >
                {camera.status === "online" ? (
                  <><Wifi className="h-3 w-3 mr-1" />Online</>
                ) : (
                  <><WifiOff className="h-3 w-3 mr-1" />Offline</>
                )}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{camera.cameraName}</h3>
              <p className="text-sm text-muted-foreground">{camera.location}</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Link className="h-4 w-4 shrink-0" />
              <span className="font-mono text-xs truncate max-w-[200px]">{camera.cameraStreamUrl}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm font-medium">AI Detection</p>
                <p className="text-xs text-muted-foreground">Face & motion</p>
              </div>
              <Switch
                checked={camera.aiEnabled}
                onCheckedChange={() => onToggleAI(camera.cameraId, camera.aiEnabled)}
              />
            </div>
            <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm font-medium">Recording</p>
                <p className="text-xs text-muted-foreground">24/7 record</p>
              </div>
              <Switch
                checked={camera.recordingEnabled}
                onCheckedChange={() => onToggleRecording(camera.cameraId, camera.recordingEnabled)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex lg:flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onEdit(camera)}
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Camera</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove &quot;{camera.cameraName}&quot;? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(camera.cameraId)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}