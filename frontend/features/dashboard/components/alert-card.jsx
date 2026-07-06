"use client";

import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  User, 
  UserX, 
  Video, 
  VideoOff,
  Bell 
} from "lucide-react";
import { MOCK_DATES } from "@/lib/mock-data";

const alertIcons = {
  unknown_person: UserX,
  motion: AlertTriangle,
  face_recognized: User,
  camera_offline: VideoOff,
  default: Bell,
};

const severityColors = {
  high: "border-l-red-500 bg-red-500/5",
  medium: "border-l-amber-500 bg-amber-500/5",
  low: "border-l-primary bg-primary/5",
};

const severityIconColors = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-primary",
};

function formatTimeAgo(timestamp) {
  const date = new Date(timestamp);

  const diffMs =
    new Date(MOCK_DATES.NOW).getTime() -
    date.getTime();

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US");
}

export function AlertCard({ alert }) {
  const Icon = alertIcons[alert.type] || alertIcons.default;
  
  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border-l-4 transition-colors hover:bg-secondary/30",
        severityColors[alert.severity] || severityColors.low
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary",
        severityIconColors[alert.severity]
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{alert.message}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{alert.camera}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(alert.timestamp)}</span>
        </div>
      </div>
    </div>
  );
}
