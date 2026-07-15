"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    X,
    Lock,
    LogOut,
    Copy,
    Check,
    Shield,
    History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/contexts/auth-context";
import { uploadAvatarAction } from "@/features/profile/actions/upload-avatar";
import { removeAvatarAction } from "@/features/profile/actions/remove-avatar";
import { updateCurrentUserAction } from "@/features/profile/actions/update-current-user";
import { ChangePasswordDialog } from "@/features/profile/components/change-password-dialog";
import { LoginHistoryDialog } from "@/features/profile/components/login-history-dialog";
import { getUserLoginLogs } from "@/features/profile/services/profile-service";
import type {
    Profile,
    LoginLog,
    EditedProfile,
    UpdateCurrentUserValues,
} from "@/features/profile/types/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EMPTY_PROFILE: Profile = {
    id: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
    lastLogin: null,
    avatar: null,
    ipAddress: "",
    userAgent: "",
};

export default function ProfilePage() {
    const router = useRouter();
    const { user, logout, isLoading, loadUser } = useAuth();
    const [isEditing, isSetEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [copied, setCopied] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [editedProfile, setEditedProfile] = useState<Profile | null>(
        EMPTY_PROFILE,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isLoginHistoryOpen, setIsLoginHistoryOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);

    useEffect(() => {
        if (!user) return;

        const profileData: Profile = {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            location: user.location,
            joinDate: user.joinDate,
            lastLogin: user.lastLogin,
            avatar: user.avatarUrl,
            ipAddress: user.ipAddress,
            userAgent: user.userAgent,
        };

        setProfile(profileData);
        setEditedProfile(profileData);
    }, [user]);

    const handleEdit = (): void => {
        if (!profile) return;

        isSetEditing(true);
        setEditedProfile(profile);
    };

    const handleCancel = (): void => {
        isSetEditing(false);
        setEditedProfile(profile);
    };

    const handleSave = async (): Promise<void> => {
        if (!editedProfile) return;

        setIsSaving(true);

        try {
            const [firstName, ...rest] = editedProfile.name.trim().split(" ");
            const lastName = rest.join(" ");

            const values: UpdateCurrentUserValues = {
                firstName: firstName,
                lastName: lastName,
                email: editedProfile.email,
                phone: editedProfile.phone,
                location: editedProfile.location,
            };

            const result = await updateCurrentUserAction(values);

            if (!result.success) {
                if (result.errors) {
                    Object.values(result.errors)
                        .reverse()
                        .forEach((error) => toast.error(String(error)));

                    return;
                }

                toast.error(result.message);
                return;
            }

            toast.success(result.message ?? "Profile updated successfully");

            await loadUser();

            isSetEditing(false);
            setIsSaving(false);
        }
    };

    const handleInputChange = (
        field: keyof EditedProfile,
        value: string,
    ): void => {
        if (!editedProfile) return;

        setEditedProfile({
            ...editedProfile,
            [field]: value,
        });
    };

    const handleCopyId = (): void => {
        if (!profile) return;

        navigator.clipboard.writeText(profile.id);

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    async function handleAvatarUpload(
        event: React.ChangeEvent<HTMLInputElement>,
    ): Promise<void> {
        const file = event.target.files?.[0];

        if (!file) return;

        setSelectedFile(file);

        event.target.value = "";

        setIsUploadDialogOpen(true);
    }

    async function handleRemoveAvatar() {
        const result = await removeAvatarAction();

        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success(result.message || "Profile photo removed");

        await loadUser();
        setIsRemoveDialogOpen(false);
    }

    async function confirmUpload(): Promise<void> {
        if (!selectedFile) return;

        const result = await uploadAvatarAction(selectedFile);

        if (!result.success) {
            toast.error(result.message);
            return;
        }
        toast.success("Profile photo updated");

        await loadUser();
        setSelectedFile(null);
        setIsUploadDialogOpen(false);
    }

    async function handleLogout(): Promise<void> {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await logout();
        } finally {
            router.replace("/sign-in");
            setIsLoggingOut(false);
        }
    }

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            User Profile
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage your account information and settings
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button onClick={handleEdit} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="border-border lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Profile Picture
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24 border-2 border-primary">
                                    <AvatarImage
                                        src={profile?.avatar || undefined}
                                        alt={profile?.name}
                                    />
                                    <AvatarFallback>
                                        {profile?.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-center">
                                    <p className="font-semibold text-foreground">
                                        {profile?.name}
                                    </p>
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Upload Photo
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full text-destructive hover:text-destructive"
                                    onClick={() => setIsRemoveDialogOpen(true)}
                                >
                                    Remove Photo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal Information */}
                    <Card className="border-border lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <User className="h-5 w-5 text-primary" />
                                Personal Information
                            </CardTitle>
                            <CardDescription>
                                Your account details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={editedProfile?.name}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "name",
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-secondary/50 border-border"
                                        />
                                    ) : (
                                        <div className="p-2.5 rounded-lg bg-secondary/30 text-foreground">
                                            {profile?.name}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-primary" />
                                        Email Address
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="email"
                                            value={editedProfile?.email}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-secondary/50 border-border"
                                        />
                                    ) : (
                                        <div className="p-2.5 rounded-lg bg-secondary/30 text-foreground">
                                            {profile?.email}
                                        </div>
                                    )}
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-primary" />
                                        Phone Number
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            type="tel"
                                            value={editedProfile?.phone ?? ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "phone",
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-secondary/50 border-border"
                                        />
                                    ) : (
                                        <div className="p-2.5 rounded-lg bg-secondary/30 text-foreground">
                                            {profile?.phone}
                                        </div>
                                    )}
                                </div>

                                {/* Location */}
                                <div className="space-y-2 sm:col-span-2">
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        Location
                                    </Label>
                                    {isEditing ? (
                                        <Input
                                            value={
                                                editedProfile?.location ?? ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "location",
                                                    e.target.value,
                                                )
                                            }
                                            className="bg-secondary/50 border-border"
                                        />
                                    ) : (
                                        <div className="p-2.5 rounded-lg bg-secondary/30 text-foreground">
                                            {profile?.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Account Information */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Account Information
                            </CardTitle>
                            <CardDescription>
                                System and login details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            User ID
                                        </p>
                                        <p className="text-sm font-mono text-foreground">
                                            {profile?.id}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopyId}
                                        className="gap-2"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            IP Address
                                        </p>
                                        <p className="text-sm text-foreground flex items-center gap-1">
                                            {profile?.ipAddress}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Account Created
                                        </p>
                                        <p className="text-sm text-foreground flex items-center gap-1">
                                            {profile?.joinDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Last Login
                                        </p>
                                        <p className="text-sm text-foreground">
                                            {profile?.lastLogin || "Never"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={() => setIsLoginHistoryOpen(true)}
                            >
                                <Shield className="h-4 w-4" />
                                View Login History
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security Settings */}
                    <Card className="border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Lock className="h-5 w-5 text-primary" />
                                Password Settings
                            </CardTitle>

                            <CardDescription>
                                Manage your account password.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={() => setIsChangePasswordOpen(true)}
                            >
                                <Lock className="h-4 w-4" />
                                Change Password
                            </Button>

                            <Separator />

                            <div className="space-y-1 text-sm">
                                <p className="font-medium">Password</p>
                                <p className="text-muted-foreground">
                                    For security, use a unique password that you
                                    don't use on other websites.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Logout Button */}
                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        className="gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            <AlertDialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Upload new profile photo?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will replace your current profile photo.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction onClick={confirmUpload}>
                            Upload
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isRemoveDialogOpen}
                onOpenChange={setIsRemoveDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remove profile photo?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Your avatar will be removed and replaced with the
                            default profile image.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction onClick={handleRemoveAvatar}>
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Login History Dialog */}
            <LoginHistoryDialog
                open={isLoginHistoryOpen}
                onOpenChange={setIsLoginHistoryOpen}
                loginHistory={loginLogs}
            />

            {/* Change Password Dialog */}
            <ChangePasswordDialog
                open={isChangePasswordOpen}
                onOpenChange={setIsChangePasswordOpen}
            />
        </DashboardLayout>
    );
}
