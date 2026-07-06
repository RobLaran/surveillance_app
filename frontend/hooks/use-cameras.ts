import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface Camera {
    cameraId: number;
    userId: number;
    cameraName: string;
    cameraStreamUrl: string;
    camerType: string;
    location: string;
    status: string;
    aiEnabled: boolean;
    recordingEnabled: boolean;
    motionDetectionEnabled: boolean;
    detections: [];
}

function formatCamera(camera: any): Camera {
  return {
    cameraId: camera.camera_id,
    userId: camera.user_id ?? 1,
    cameraName: camera.camera_name,
    cameraStreamUrl: camera.camera_stream_url,
    camerType: camera.camer_type,
    location: camera.location,
    status: camera.status,
    aiEnabled: camera.ai_enabled,
    recordingEnabled: camera.recording_enabled,
    motionDetectionEnabled: camera.motion_detection_enabled,
    detections: [],
  };
}

export function useCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);

  async function loadCameras() {
    const { data, error } = await supabase.from("cameras").select("*");
    if (error) {
      console.error("LOAD ERROR:", error);
      return;
    }
    setCameras(data.map(formatCamera));
  }

  useEffect(() => {
    loadCameras();

    const channel = supabase
      .channel("cameras-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cameras" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setCameras((prev) => [...prev, formatCamera(payload.new)]);
          }
          if (payload.eventType === "UPDATE") {
            setCameras((prev) =>
              prev.map((c) =>
                c.cameraId === payload.new.camera_id ? formatCamera(payload.new) : c
              )
            );
          }
          if (payload.eventType === "DELETE") {
            setCameras((prev) => prev.filter((c) => c.cameraId !== payload.old.camera_id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addCamera = async (newCamera: {
    cameraName: string;
    location: string;
    cameraStreamUrl: string;
  }) => {
    const { error } = await supabase.from("cameras").insert([{
      camera_name: newCamera.cameraName,
      location: newCamera.location || "Unknown",
      camera_stream_url: newCamera.cameraStreamUrl,
      status: "offline",
      recording_enabled: false,
      motion_detection_enabled: false,
      ai_enabled: false,
    }]);
    if (error) console.error("ADD ERROR:", error);
  };

  const editCamera = async (camera: Camera) => {
    const { error } = await supabase
      .from("cameras")
      .update({
        camera_name: camera.cameraName,
        location: camera.location,
        camera_stream_url: camera.cameraStreamUrl,
      })
      .eq("camera_id", camera.cameraId);
    if (error) console.error("EDIT ERROR:", error);
  };

  const deleteCamera = async (cameraId: number) => {
    const { error } = await supabase.from("cameras").delete().eq("camera_id", cameraId);
    if (error) console.error("DELETE ERROR:", error);
  };

  const toggleAI = async (cameraId: number, current: boolean) => {
    const { data, error } = await supabase
      .from("cameras")
      .update({ ai_enabled: !current })
      .eq("camera_id", cameraId)
      .select();

      console.log("[TOGGLE AI]", { data, error });
    if (error) console.error("TOGGLE AI ERROR:", error);
  };

  const toggleRecording = async (cameraId: number, current: boolean) => {
    const { error } = await supabase
      .from("cameras")
      .update({ recording_enabled: !current })
      .eq("camera_id", cameraId);
    if (error) console.error("TOGGLE RECORDING ERROR:", error);
  };

  return {
    cameras,
    addCamera,
    editCamera,
    deleteCamera,
    toggleAI,
    toggleRecording,
  };
}