"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddCameraDialogProps {
  onAdd: (camera: { cameraName: string; location: string; cameraStreamUrl: string }) => Promise<void>;
}

export function AddCameraDialog({ onAdd }: AddCameraDialogProps) {
  const [open, setOpen] = useState(false);
  const [newCamera, setNewCamera] = useState({
    cameraName: "",
    location: "",
    cameraStreamUrl: "",
  });

  const handleAdd = async () => {
    if (!newCamera.cameraName.trim() || !newCamera.cameraStreamUrl.trim()) return;
    await onAdd(newCamera);
    setNewCamera({ cameraName: "", location: "", cameraStreamUrl: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Camera
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Camera</DialogTitle>
          <DialogDescription>
            Enter the camera details and stream URL to add a new camera.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="camera-name">Camera Name</Label>
            <Input
              id="camera-name"
              placeholder="e.g., Front Door"
              value={newCamera.cameraName}
              onChange={(e) => setNewCamera({ ...newCamera, cameraName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="camera-location">Location</Label>
            <Input
              id="camera-location"
              placeholder="e.g., Entrance"
              value={newCamera.location}
              onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-url">Stream URL</Label>
            <Input
              id="stream-url"
              placeholder="rtsp://192.168.1.100:554/stream"
              value={newCamera.cameraStreamUrl}
              onChange={(e) => setNewCamera({ ...newCamera, cameraStreamUrl: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!newCamera.cameraName.trim() || !newCamera.cameraStreamUrl.trim()}
          >
            Add Camera
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}