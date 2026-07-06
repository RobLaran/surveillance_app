"use client";

import { useState } from "react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { systemSettings } from "@/lib/mock-data";
import { 
  Bell, 
  MessageSquare, 
  Video, 
  Shield, 
  Wifi, 
  HardDrive,
  Mail,
  Smartphone,
  Gauge,
  Calendar,
  Globe,
  Save,
  RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [settings, setSettings] = useState(systemSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(systemSettings);
    setHasChanges(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure system preferences and notifications
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleReset}
              disabled={!hasChanges}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              size="sm" 
              className="gap-2"
              onClick={handleSave}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alert Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5 text-primary" />
                Alert Settings
              </CardTitle>
              <CardDescription>Configure how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Alert System</Label>
                  <p className="text-xs text-muted-foreground">Enable real-time alerts</p>
                </div>
                <Switch
                  checked={settings.alertsEnabled}
                  onCheckedChange={(checked) => updateSetting("alertsEnabled", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send alerts via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => updateSetting("smsNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
                    <Mail className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send alerts via email</p>
                  </div>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send push to mobile app</p>
                  </div>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Recording Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Video className="h-5 w-5 text-primary" />
                Recording Settings
              </CardTitle>
              <CardDescription>Configure motion detection and recording</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Auto-Record on Motion</Label>
                  <p className="text-xs text-muted-foreground">Automatically record when motion is detected</p>
                </div>
                <Switch
                  checked={settings.autoRecordOnMotion}
                  onCheckedChange={(checked) => updateSetting("autoRecordOnMotion", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                      <Gauge className="h-4 w-4 text-amber-500" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Motion Sensitivity</Label>
                      <p className="text-xs text-muted-foreground">Adjust detection threshold</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary">{settings.motionSensitivity}%</span>
                </div>
                <Slider
                  value={[settings.motionSensitivity]}
                  onValueChange={([value]) => updateSetting("motionSensitivity", value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <Calendar className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Retention Period</Label>
                    <p className="text-xs text-muted-foreground">Days to keep recordings</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[settings.retentionDays]}
                    onValueChange={([value]) => updateSetting("retentionDays", value)}
                    max={90}
                    min={7}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-16 text-right">{settings.retentionDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>General system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Remote Access</Label>
                    <p className="text-xs text-muted-foreground">Allow external connections</p>
                  </div>
                </div>
                <Switch
                  checked={settings.remoteAccessEnabled}
                  onCheckedChange={(checked) => updateSetting("remoteAccessEnabled", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Remote Access Status */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wifi className="h-5 w-5 text-primary" />
                Remote Access Status
              </CardTitle>
              <CardDescription>Connection information for remote monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={cn(
                    settings.remoteAccessEnabled
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  )}>
                    {settings.remoteAccessEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">External IP</span>
                  <span className="text-sm font-mono text-foreground">192.168.1.1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Port</span>
                  <span className="text-sm font-mono text-foreground">8443</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Access URL</span>
                  <span className="text-sm font-mono text-foreground truncate max-w-[180px]">
                    https://sentinel.local:8443
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Use the access URL to connect to your surveillance system from anywhere.
                Ensure port forwarding is configured on your router.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
