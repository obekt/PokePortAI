import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Settings, Eye, EyeOff, Share2, Users } from "lucide-react";
import type { UserProfile } from "@shared/schema";

export default function ProfileSettings() {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/profile', user?.id],
    enabled: !!user?.id,
    retry: false,
  });

  // Update form when profile data loads
  React.useEffect(() => {
    if (profile && !isEditing) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setIsPublic(profile.isPublic || false);
    }
  }, [profile, isEditing]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { displayName?: string; bio?: string; isPublic: boolean }) => {
      const response = await apiRequest("PUT", "/api/profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to update your profile",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({
      displayName: displayName.trim() || undefined,
      bio: bio.trim() || undefined,
      isPublic,
    });
  };

  const handleCancel = () => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setIsPublic(profile.isPublic || false);
    }
    setIsEditing(false);
  };

  const copyProfileLink = () => {
    if (profile?.isPublic && user?.id) {
      const profileUrl = `${window.location.origin}/portfolio/${user.id}`;
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied!",
        description: "Your public portfolio link has been copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="card-glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            {isEditing ? (
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                maxLength={50}
              />
            ) : (
              <p className="text-slate-800 font-medium">
                {displayName || "No display name set"}
              </p>
            )}
            <p className="text-xs text-slate-500">
              This name will be shown on your public portfolio
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about your Pokemon card collection..."
                maxLength={200}
                rows={3}
              />
            ) : (
              <p className="text-slate-600">
                {bio || "No bio added yet"}
              </p>
            )}
            <p className="text-xs text-slate-500">
              {bio.length}/200 characters
            </p>
          </div>

          {/* Public Portfolio Toggle */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isPublic" className="text-base font-medium">
                  Public Portfolio
                </Label>
                <p className="text-sm text-slate-500">
                  Allow others to view your portfolio and leave comments
                </p>
              </div>
              {isEditing ? (
                <Switch
                  id="isPublic"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  {isPublic ? (
                    <>
                      <Eye className="h-4 w-4 text-green-600" />
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Public
                      </Badge>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-slate-400" />
                      <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                        Private
                      </Badge>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Portfolio Stats */}
            {profile && (
              <div className="flex items-center space-x-6 text-sm text-slate-500 pt-2 border-t border-slate-200">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{profile.viewCount || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>❤️</span>
                  <span>{profile.likeCount || 0} likes</span>
                </div>
              </div>
            )}

            {/* Share Link */}
            {isPublic && !isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyProfileLink}
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Copy Portfolio Link
              </Button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="gradient-primary"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}