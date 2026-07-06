"use client";

import * as React from "react";
import { Video, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface ThumbnailImageProps {
  cameraId: number;
  className?: string;
}

function ThumbnailImage({ cameraId, className }: ThumbnailImageProps) {
  const [ts, setTs] = React.useState(Date.now());
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const refresh = () => {
    setError(false);
    setLoading(true);
    setTs(Date.now());
  };

  if (error) {
    return (
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center",
          className
        )}
      >
        <Video className="h-8 w-8 text-zinc-600" />
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0", className)}>
      <img
        src={`${API_URL}/cameras/${cameraId}/thumbnail?t=${ts}`}
        alt={`Camera ${cameraId}`}
        className="w-full h-full object-cover"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
      />

      {/* Loading shimmer */}
      {loading && (
        <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
      )}

      {/* Refresh button */}
      {!loading && (
        <button
          onClick={refresh}
          className="absolute bottom-2 right-2 p-1.5 rounded-md bg-black/50 hover:bg-black/70 text-white transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export { ThumbnailImage };