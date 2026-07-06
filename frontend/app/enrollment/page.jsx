"use client";

import { useState } from "react";
import { DashboardLayout } from "@/features/dashboard/components/dashboard-layout";
import { FaceCard } from "@/features/dashboard/components/face-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { enrolledFaces as initialFaces } from "@/lib/mock-data";
import { UserPlus, Upload, Camera, User, Search, X } from "lucide-react";

export default function EnrollmentPage() {
  const [faces, setFaces] = useState(initialFaces);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [newFace, setNewFace] = useState({ name: "", role: "Family" });

  const filteredFaces = faces.filter((face) =>
    face.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnroll = () => {
    if (newFace.name.trim()) {
      const face = {
        id: Date.now(),
        name: newFace.name,
        role: newFace.role,
        enrolledAt: new Date(),
        imageUrl: selectedImage,
      };
      setFaces([face, ...faces]);
      setNewFace({ name: "", role: "Family" });
      setSelectedImage(null);
      setDialogOpen(false);
    }
  };

  const handleDelete = (id) => {
    setFaces(faces.filter((f) => f.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Face Enrollment</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Register family members and authorized persons for face recognition
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Enroll New Face
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enroll New Person</DialogTitle>
                <DialogDescription>
                  Upload a clear photo and enter the person&apos;s details for face recognition.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-32 w-32 rounded-full border-2 border-dashed border-border bg-secondary/50 flex items-center justify-center overflow-hidden">
                    {selectedImage ? (
                      <>
                        <img
                          src={selectedImage}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-0 right-0 p-1 bg-destructive text-destructive-foreground rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Camera className="h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter person's name"
                      value={newFace.name}
                      onChange={(e) => setNewFace({ ...newFace, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Category</Label>
                    <Select
                      value={newFace.role}
                      onValueChange={(value) => setNewFace({ ...newFace, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Family">Family</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Housekeeper">Housekeeper</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEnroll} disabled={!newFace.name.trim()}>
                  Enroll Person
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search enrolled faces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{faces.length} enrolled faces</span>
          </div>
        </div>

        {/* Faces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaces.map((face) => (
            <FaceCard key={face.id} face={face} onDelete={handleDelete} />
          ))}
        </div>

        {filteredFaces.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg mb-2">No faces found</CardTitle>
              <CardDescription>
                {searchQuery
                  ? "No faces match your search criteria"
                  : "Start by enrolling your first face"}
              </CardDescription>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
