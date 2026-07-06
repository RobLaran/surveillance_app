"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "@/hooks/use-cameras";

interface EditCameraDialogProps {
  camera: Camera | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (camera: Camera) => Promise<void>;
}

export function EditCameraDialog({ camera, open, onOpenChange, onEdit }: EditCameraDialogProps) {
  const [editingCamera, setEditingCamera] = useState<Camera | null>(camera);

  useEffect(() => {
    setEditingCamera(camera);
  }, [camera]);

  const handleSave = async () => {
    if (!editingCamera?.cameraName.trim() || !editingCamera?.cameraStreamUrl.trim()) return;
    await onEdit(editingCamera);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Camera</DialogTitle>
          <DialogDescription>Update the camera details below.</DialogDescription>
        </DialogHeader>
        {editingCamera && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-camera-name">Camera Name</Label>
              <Input
                id="edit-camera-name"
                placeholder="e.g., Front Door"
                value={editingCamera.cameraName}
                onChange={(e) => setEditingCamera({ ...editingCamera, cameraName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-camera-location">Location</Label>
              <Input
                id="edit-camera-location"
                placeholder="e.g., Entrance"
                value={editingCamera.location}
                onChange={(e) => setEditingCamera({ ...editingCamera, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stream-url">Stream URL</Label>
              <Input
                id="edit-stream-url"
                placeholder="rtsp://192.168.1.100:554/stream"
                value={editingCamera.cameraStreamUrl}
                onChange={(e) => setEditingCamera({ ...editingCamera, cameraStreamUrl: e.target.value })}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editingCamera?.cameraName.trim() || !editingCamera?.cameraStreamUrl.trim()}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}