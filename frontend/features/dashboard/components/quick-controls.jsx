"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Bell, MessageSquare, Video, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function QuickControls() {
  const [alertSystem, setAlertSystem] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [motionRecording, setMotionRecording] = useState(true);

  const controls = [
    {
      id: "alerts",
      label: "Alert System",
      description: "Enable real-time alerts",
      icon: Bell,
      enabled: alertSystem,
      onChange: setAlertSystem,
      activeColor: "text-primary",
    },
    {
      id: "sms",
      label: "SMS Notifications",
      description: "Send alerts via SMS",
      icon: MessageSquare,
      enabled: smsNotifications,
      onChange: setSmsNotifications,
      activeColor: "text-blue-500",
    },
    {
      id: "motion",
      label: "Motion Recording",
      description: "Auto-record on motion",
      icon: Video,
      enabled: motionRecording,
      onChange: setMotionRecording,
      activeColor: "text-amber-500",
    },
  ];

  return (
    <div className="space-y-3">
      {controls.map((control) => (
        <div 
          key={control.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border transition-colors",
            control.enabled 
              ? "bg-secondary/50 border-border" 
              : "bg-secondary/20 border-transparent"
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg bg-secondary",
              control.enabled ? control.activeColor : "text-muted-foreground"
            )}>
              <control.icon className="h-4 w-4" />
            </div>
            <div>
              <Label 
                htmlFor={control.id} 
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                {control.label}
              </Label>
              <p className="text-xs text-muted-foreground">{control.description}</p>
            </div>
          </div>
          <Switch
            id={control.id}
            checked={control.enabled}
            onCheckedChange={control.onChange}
          />
        </div>
      ))}
    </div>
  );
}
