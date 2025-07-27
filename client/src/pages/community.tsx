import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Eye, MessageCircle, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import type { UserProfile, User } from "@shared/schema";

interface PublicProfile extends UserProfile {
  user: User;
  cardCount: number;
  totalValue: number;
}

export default function Community() {
  const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');

  const { data: publicProfiles = [], isLoading } = useQuery<PublicProfile[]>({
    queryKey: ['/api/community/portfolios'],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading community portfolios...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Community Portfolios
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover amazing Pokemon card collections from collectors around the world
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-glass">
            <CardContent className="flex items-center p-6">
              <div className="gradient-primary p-3 rounded-xl mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{publicProfiles.length}</p>
                <p className="text-slate-600 text-sm">Public Portfolios</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-glass">
            <CardContent className="flex items-center p-6">
              <div className="gradient-secondary p-3 rounded-xl mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  ${publicProfiles.reduce((sum, profile) => sum + profile.totalValue, 0).toLocaleString()}
                </p>
                <p className="text-slate-600 text-sm">Total Value</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="flex items-center p-6">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl mr-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">
                  {publicProfiles.reduce((sum, profile) => sum + (profile.likeCount || 0), 0)}
                </p>
                <p className="text-slate-600 text-sm">Total Likes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === 'trending' ? 'default' : 'outline'}
            onClick={() => setActiveTab('trending')}
            className="px-6"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending
          </Button>
          <Button
            variant={activeTab === 'recent' ? 'default' : 'outline'}
            onClick={() => setActiveTab('recent')}
            className="px-6"
          >
            <Users className="h-4 w-4 mr-2" />
            Most Popular
          </Button>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicProfiles.map((profile) => (
            <Link key={profile.userId} href={`/portfolio/${profile.userId}`}>
              <Card className="card-glass hover:scale-105 transition-all duration-300 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                      <AvatarImage src={profile.user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {profile.displayName?.charAt(0) || profile.user.firstName?.charAt(0) || profile.user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {profile.displayName || `${profile.user.firstName || ''} ${profile.user.lastName || ''}`.trim() || 'Anonymous Collector'}
                      </CardTitle>
                      <p className="text-slate-500 text-sm">{profile.cardCount} cards</p>
                    </div>
                  </div>
                  {profile.bio && (
                    <p className="text-slate-600 text-sm mt-2 line-clamp-2">{profile.bio}</p>
                  )}
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-slate-800">
                        ${profile.totalValue.toLocaleString()}
                      </p>
                      <p className="text-slate-500 text-xs">Total Value</p>
                    </div>
                    <Badge variant="secondary" className="gradient-primary text-white border-0">
                      Public
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{profile.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{profile.viewCount || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>View</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {publicProfiles.length === 0 && (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Public Portfolios Yet</h3>
            <p className="text-slate-500">Be the first to share your collection with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
}