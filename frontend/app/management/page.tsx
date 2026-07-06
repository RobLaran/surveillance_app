"use client";

import { useState } from "react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Video } from "lucide-react";
import { useCameras, Camera } from "@/hooks/use-cameras";
import { AddCameraDialog } from "@/components/ui/add-camera-dialog";
import { EditCameraDialog } from "@/components/ui/edit-camera-dialog";
import { CameraCard } from "@/components/ui/camera-card";

export default function CameraManagementPage() {
    const {
        cameras,
        addCamera,
        editCamera,
        deleteCamera,
        toggleAI,
        toggleRecording,
    } = useCameras();
    
    const [editingCamera, setEditingCamera] = useState<Camera | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleEdit = (camera: Camera) => {
        setEditingCamera(camera);
        setEditDialogOpen(true);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            Camera Management
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Configure and manage your surveillance cameras
                        </p>
                    </div>
                    <AddCameraDialog onAdd={addCamera} />
                </div>

                {/* Camera List */}
                <div className="grid gap-4">
                    {cameras.map((camera) => (
                        <CameraCard
                            key={camera.cameraId}
                            camera={camera}
                            onEdit={handleEdit}
                            onDelete={deleteCamera}
                            onToggleAI={toggleAI}
                            onToggleRecording={toggleRecording}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {cameras.length === 0 && (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Video className="h-12 w-12 text-muted-foreground mb-4" />
                            <CardTitle className="text-lg mb-2">
                                No cameras configured
                            </CardTitle>
                            <CardDescription>
                                Add your first camera to start monitoring
                            </CardDescription>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Edit Dialog */}
            <EditCameraDialog
                camera={editingCamera}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onEdit={editCamera}
            />
        </DashboardLayout>
    );
}
