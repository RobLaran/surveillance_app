"use client";

import { cn } from "@/lib/utils";
import { 
  User, 
  Move, 
  Video, 
  VideoOff, 
  UserX, 
  MessageSquare,
  Circle 
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const eventTypeIcons = {
  "Face Recognized": User,
  "Motion Detected": Move,
  "Recording Started": Video,
  "Camera Offline": VideoOff,
  "Unknown Person": UserX,
  "SMS Alert Sent": MessageSquare,
};

const eventTypeColors = {
  "Face Recognized": "bg-primary/10 text-primary",
  "Motion Detected": "bg-amber-500/10 text-amber-500",
  "Recording Started": "bg-blue-500/10 text-blue-500",
  "Camera Offline": "bg-red-500/10 text-red-500",
  "Unknown Person": "bg-red-500/10 text-red-500",
  "SMS Alert Sent": "bg-purple-500/10 text-purple-500",
};

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function EventTable({ events, compact = false }) {
  if (compact) {
    return (
      <div className="space-y-2">
        {events.slice(0, 5).map((event) => {
          const Icon = eventTypeIcons[event.eventType] || Circle;
          return (
            <div 
              key={event.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/30 transition-colors"
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                eventTypeColors[event.eventType] || "bg-muted"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{event.eventType}</p>
                <p className="text-xs text-muted-foreground truncate">{event.camera}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{formatTime(event.timestamp)}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/30 hover:bg-secondary/30">
            <TableHead className="text-muted-foreground font-medium">Time</TableHead>
            <TableHead className="text-muted-foreground font-medium">Camera</TableHead>
            <TableHead className="text-muted-foreground font-medium">Event</TableHead>
            <TableHead className="text-muted-foreground font-medium">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            const Icon = eventTypeIcons[event.eventType] || Circle;
            return (
              <TableRow key={event.id} className="hover:bg-secondary/20">
                <TableCell className="font-mono text-sm">
                  {formatTime(event.timestamp)}
                </TableCell>
                <TableCell className="text-sm">{event.camera}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={cn("gap-1", eventTypeColors[event.eventType])}
                  >
                    <Icon className="h-3 w-3" />
                    {event.eventType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{event.details}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
