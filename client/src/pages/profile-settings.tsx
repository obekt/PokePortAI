import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Settings, Eye, EyeOff, Share2, Users, ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import type { UserProfile } from "@shared/schema";

export default function ProfileSettingsPage() {
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
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setIsPublic(profile.isPublic || false);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: { displayName?: string; bio?: string; isPublic: boolean }) => {
      const response = await apiRequest("PUT", "/api/profile", profileData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
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

  const copyProfileLink = () => {
    if (isPublic && user?.id) {
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
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading profile settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Profile Settings</h1>
              <p className="text-slate-600">Manage your profile and privacy settings</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Preview */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Profile Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-blue-100">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                  {displayName?.charAt(0) || user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Anonymous Collector'}
              </h3>
              
              {bio && (
                <p className="text-slate-600 text-sm mb-4">{bio}</p>
              )}

              <div className="flex items-center justify-center space-x-2 mb-4">
                {isPublic ? (
                  <>
                    <Eye className="h-4 w-4 text-green-600" />
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Public Profile
                    </Badge>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4 text-slate-400" />
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                      Private Profile
                    </Badge>
                  </>
                )}
              </div>

              {profile && (
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{profile.viewCount || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>{profile.likeCount || 0} likes</span>
                  </div>
                </div>
              )}

              {isPublic && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyProfileLink}
                  className="w-full mt-4"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Copy Profile Link
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    maxLength={50}
                  />
                  <p className="text-xs text-slate-500">
                    This name will be shown on your public portfolio and in the community
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell others about your Pokemon card collection..."
                    maxLength={200}
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">
                    {bio.length}/200 characters
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="card-glass">
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="isPublic" className="text-base font-medium">
                        Public Portfolio
                      </Label>
                      <p className="text-sm text-slate-500">
                        Allow others to view your portfolio and leave comments
                      </p>
                    </div>
                    <Switch
                      id="isPublic"
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>

                  {isPublic && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Public Portfolio Features</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Your cards will be visible to the community</li>
                        <li>• Other users can comment on your portfolio</li>
                        <li>• Your portfolio can be liked and shared</li>
                        <li>• You'll appear in community discovery feeds</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex space-x-3">
              <Button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="gradient-primary flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/">
                <Button variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}