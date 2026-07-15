"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";
import { LoginLog } from "@/features/profile/types/login-log";

interface LoginHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loginHistory: LoginLog[];
}

export function LoginHistoryDialog({
    open,
    onOpenChange,
    loginHistory,
}: LoginHistoryDialogProps) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (date: string) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const getStatusColor = (status: string) => {
        return status === "SUCCESS"
            ? "bg-green-500/10 text-green-500 border-0"
            : "bg-red-500/10 text-red-500 border-0";
    };

    const getStatusIcon = (status: string) => {
        return status === "SUCCESS" ? (
            <CheckCircle className="h-4 w-4" />
        ) : (
            <XCircle className="h-4 w-4" />
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-screen min-w-4xl border-border bg-card">
                <DialogHeader>
                    <DialogTitle className="text-xl">Login History</DialogTitle>
                    <DialogDescription>
                        View all login attempts and sessions
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-96 overflow-y-auto rounded-lg border border-border">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 bg-secondary/50">
                            <TableRow className="border-border hover:bg-secondary/50">
                                <TableHead className="text-muted-foreground text-xs py-2 px-2 w-32">
                                    Date
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs py-2 px-2 w-32">
                                    Time
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs py-2 px-2 flex-1">
                                    IP Address
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs py-2 px-2 flex-1">
                                    Device
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs py-2 px-2 flex-1">
                                    Platform
                                </TableHead>
                                <TableHead className="text-muted-foreground text-xs py-2 px-2 w-32">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loginHistory.map((login) => (
                                <TableRow
                                    key={login.id}
                                    className="border-border hover:bg-secondary/20"
                                >
                                    <TableCell className="text-xs py-2 px-2 text-foreground">
                                        {formatDate(login.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-xs py-2 px-2 text-muted-foreground">
                                        {formatTime(login.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-xs py-2 px-2 font-mono text-primary">
                                        {login.ipAddress}
                                    </TableCell>
                                    <TableCell className="text-xs py-2 px-2 text-foreground truncate">
                                        {login.device}
                                    </TableCell>
                                    <TableCell className="text-xs py-2 px-2 text-foreground truncate">
                                        {login.browser} • {login.os}
                                    </TableCell>
                                    <TableCell className="text-xs py-2 px-2">
                                        <Badge
                                            className={`${getStatusColor(login.status)} text-xs py-0 px-1`}
                                        >
                                            {login.status === "SUCCESS" ? (
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                            ) : (
                                                <XCircle className="h-3 w-3 mr-1" />
                                            )}
                                            {login.status === "SUCCESS"
                                                ? "OK"
                                                : "Failed"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="mt-4 space-y-2 rounded-lg bg-secondary/20 p-3">
                    <p className="text-xs font-semibold text-foreground">
                        Security Tip:
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Review this list regularly to ensure all login attempts
                        are from you or authorized devices. If you see any
                        unfamiliar login activities, change your password
                        immediately.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
