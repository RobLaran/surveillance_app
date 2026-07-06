"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ThumbnailImage } from "@/components/ui/thumbnail-image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { 
  Plus, 
  Video, 
  Settings2, 
  Trash2, 
  Wifi, 
  WifiOff,
  Link,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function CameraManagementPage() {
	const [cameras, setCameras] = useState([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editingCamera, setEditingCamera] = useState(null);
	const [newCamera, setNewCamera] = useState({
		name: "",
		location: "",
		streamUrl: "",
	});

	const handleAddCamera = async () => {
		if (!newCamera.name.trim() || !newCamera.streamUrl.trim()) {
			return;
		}

		const { data, error } = await supabase
			.from("cameras")
			.insert([
			{
				name: newCamera.name,
				location: newCamera.location || "Unknown",
				stream_url: newCamera.streamUrl,
				status: "offline",
				recording: false,
				motion_detected: false,
				ai_enabled: false,
			},
			])
			.select()
			.single();

		if (error) {
			console.error("SUPABASE ERROR:", error);
			return;
		}

		// Convert DB object → frontend object
		const formattedCamera = {
			id: data.id,
			name: data.name,
			location: data.location,
			status: data.status,
			recording: data.recording,

			streamUrl: data.stream_url,
			motionDetected: data.motion_detected,
			aiEnabled: data.ai_enabled,

			detections: [],
		};

		// Update UI
		setCameras((prev) => [...prev, formattedCamera]);

		// Reset form
		setNewCamera({
			name: "",
			location: "",
			streamUrl: "",
		});

		setDialogOpen(false);
	};

	const handleEditCamera = async () => {
		if (!editingCamera?.name.trim() || !editingCamera?.streamUrl.trim()) return;

		const { error } = await supabase
			.from("cameras")
			.update({
				name: editingCamera.name,
				location: editingCamera.location,
				stream_url: editingCamera.streamUrl,
			})
			.eq("id", editingCamera.id);

		if (error) {
			console.error("EDIT ERROR:", error);
			return;
		}

		setEditDialogOpen(false);
		setEditingCamera(null);
		// realtime UPDATE handler updates state automatically
	};

	const handleDeleteCamera = (id) => {
		setCameras(cameras.filter((c) => c.id !== id));
	};

  const handleToggleAI = (id) => {
    setCameras(
      cameras.map((c) =>
        c.id === id ? { ...c, aiEnabled: !c.aiEnabled } : c
      )
    );
  };

  const handleToggleRecording = (id) => {
    setCameras(
      cameras.map((c) =>
        c.id === id ? { ...c, recording: !c.recording } : c
      )
    );
  };

	async function loadCameras() {
		const { data, error } = await supabase
			.from("cameras")
			.select("*");

		if (error) {
			console.error("LOAD ERROR:", error);
			return;
		}

		const formattedCameras = data.map((camera) => ({
			id: camera.id,
			name: camera.name,
			location: camera.location,
			status: camera.status,
			recording: camera.recording,

			streamUrl: camera.stream_url,
			motionDetected: camera.motion_detected,
			aiEnabled: camera.ai_enabled,

			detections: [],
		}));

		setCameras(formattedCameras);
	}

	useEffect(() => {
      loadCameras();

      const channel = supabase
          .channel("cameras-realtime")
          .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "cameras" },
              (payload) => {
					if (payload.eventType === "UPDATE") {
						setCameras((prev) =>
							prev.map((c) =>
								c.id === payload.new.id
									? {
										...c,
										name: payload.new.name,
										location: payload.new.location,
										streamUrl: payload.new.stream_url,
										status: payload.new.status,
										aiEnabled: payload.new.ai_enabled,
										recording: payload.new.recording,
										motionDetected: payload.new.motion_detected,
										}
									: c
							)
						);
					}

                  if (payload.eventType === "DELETE") {
                      setCameras((prev) =>
                          prev.filter((c) => c.id !== payload.old.id)
                      );
                  }

                  if (payload.eventType === "INSERT") {
                      setCameras((prev) => [
                          ...prev,
                          {
                              id: payload.new.id,
                              name: payload.new.name,
                              location: payload.new.location,
                              status: payload.new.status,
                              recording: payload.new.recording,
                              streamUrl: payload.new.stream_url,
                              motionDetected: payload.new.motion_detected,
                              aiEnabled: payload.new.ai_enabled,
                              detections: [],
                          },
                      ]);
                  }
              }
          )
          .subscribe();

      return () => {
          supabase.removeChannel(channel);
      };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Camera Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure and manage your surveillance cameras
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                    onChange={(e) =>
                      setNewCamera({ ...newCamera, cameraName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="camera-location">Location</Label>
                  <Input
                    id="camera-location"
                    placeholder="e.g., Entrance"
                    value={newCamera.location}
                    onChange={(e) =>
                      setNewCamera({ ...newCamera, location: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream-url">Stream URL (RTSP)</Label>
                  <Input
                    id="stream-url"
                    placeholder="rtsp://192.168.1.100:554/stream"
                    value={newCamera.cameraStreamUrl}
                    onChange={(e) =>
                      setNewCamera({ ...newCamera, cameraStreamUrl: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCamera}
                  disabled={!newCamera.cameraName.trim() || !newCamera.cameraStreamUrl.trim()}
                >
                  Add Camera
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Camera List */}
        <div className="grid gap-4">
          {cameras.map((camera) => (
            <Card key={camera.cameraId} className="border-border">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-4">
                  {/* Camera Preview Thumbnail */}
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
                          <>
                            <Wifi className="h-3 w-3 mr-1" />
                            Online
                          </>
                        ) : (
                          <>
                            <WifiOff className="h-3 w-3 mr-1" />
                            Offline
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Camera Info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{camera.cameraName}</h3>
                      <p className="text-sm text-muted-foreground">{camera.location}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Link className="h-4 w-4" />
                        <span className="font-mono text-xs truncate max-w-[200px]">{camera.cameraStreamUrl}</span>
                      </div>
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
                        onCheckedChange={() => handleToggleAI(camera.cameraId)}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-secondary/50">
                      <div>
                        <p className="text-sm font-medium">Recording</p>
                        <p className="text-xs text-muted-foreground">24/7 record</p>
                      </div>
                      <Switch
                        checked={camera.recordingEnabled}
                        onCheckedChange={() => handleToggleRecording(camera.cameraId)}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    {/* <Button variant="outline" size="sm" className="gap-2">
                      <Edit className="h-4 w-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button> */}
					<Button
						variant="outline"
						size="sm"
						className="gap-2"
						onClick={() => {
							setEditingCamera(camera);
							setEditDialogOpen(true);
						}}
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
                            Are you sure you want to remove &quot;{camera.name}&quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCamera(camera.id)}
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
          ))}
        </div>

        {cameras.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-2">No cameras configured</CardTitle>
              <CardDescription>Add your first camera to start monitoring</CardDescription>
            </CardContent>
          </Card>
        )}
      </div>

	  	<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
				<DialogTitle>Edit Camera</DialogTitle>
				<DialogDescription>
					Update the camera details below.
				</DialogDescription>
				</DialogHeader>
				{editingCamera && (
				<div className="space-y-4 py-4">
					<div className="space-y-2">
					<Label htmlFor="edit-camera-name">Camera Name</Label>
					<Input
						id="edit-camera-name"
						placeholder="e.g., Front Door"
						value={editingCamera.name}
						onChange={(e) =>
						setEditingCamera({ ...editingCamera, name: e.target.value })
						}
					/>
					</div>
					<div className="space-y-2">
					<Label htmlFor="edit-camera-location">Location</Label>
					<Input
						id="edit-camera-location"
						placeholder="e.g., Entrance"
						value={editingCamera.location}
						onChange={(e) =>
						setEditingCamera({ ...editingCamera, location: e.target.value })
						}
					/>
					</div>
					<div className="space-y-2">
					<Label htmlFor="edit-stream-url">Stream URL</Label>
					<Input
						id="edit-stream-url"
						placeholder="rtsp://192.168.1.100:554/stream"
						value={editingCamera.streamUrl}
						onChange={(e) =>
						setEditingCamera({ ...editingCamera, streamUrl: e.target.value })
						}
					/>
					</div>
				</div>
				)}
				<DialogFooter>
				<Button variant="outline" onClick={() => setEditDialogOpen(false)}>
					Cancel
				</Button>
				<Button
					onClick={handleEditCamera}
					disabled={!editingCamera?.name.trim() || !editingCamera?.streamUrl.trim()}
				>
					Save Changes
				</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
    </DashboardLayout>
  );
}
