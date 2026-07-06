"use client";

import { cn } from "@/lib/utils";
import { User, Trash2, Calendar, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const roleColors = {
  Family: "bg-primary/10 text-primary",
  Friend: "bg-blue-500/10 text-blue-500",
  Housekeeper: "bg-amber-500/10 text-amber-500",
  Other: "bg-muted text-muted-foreground",
};

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FaceCard({ face, onDelete }) {
  const initials = face.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="group relative flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-all">
      {/* Avatar */}
      <Avatar className="h-16 w-16 border-2 border-border">
        {face.imageUrl ? (
          <img src={face.imageUrl} alt={face.name} className="object-cover" />
        ) : (
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-foreground truncate">{face.name}</h3>
          <Badge variant="secondary" className={cn("text-xs", roleColors[face.role] || roleColors.Other)}>
            {face.role}
          </Badge>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Enrolled {formatDate(face.enrolledAt)}</span>
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete?.(face.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
