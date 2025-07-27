import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Eye, MessageCircle, Share2, ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { UserProfile, User, Card as CardType, PortfolioComment } from "@shared/schema";

interface PublicPortfolioData {
  profile: UserProfile;
  user: User;
  cards: CardType[];
  comments: (PortfolioComment & { commenterName: string; commenterImage?: string })[];
  isLiked: boolean;
}

export default function PublicPortfolio() {
  const { userId } = useParams<{ userId: string }>();
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: portfolioData, isLoading } = useQuery<PublicPortfolioData>({
    queryKey: ['/api/portfolio', userId],
    retry: false,
    enabled: !!userId,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/portfolio/${userId}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio', userId] });
      toast({
        title: "Success",
        description: portfolioData?.isLiked ? "Removed like" : "Added like",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to like portfolios",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/portfolio/${userId}/comments`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio', userId] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You need to be logged in to comment",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await apiRequest("DELETE", `/api/comments/${commentId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio', userId] });
      toast({
        title: "Success",
        description: "Comment deleted",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading portfolio...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Portfolio Not Found</h1>
            <p className="text-slate-600 mb-8">This portfolio may be private or doesn't exist.</p>
            <Link href="/community">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Community
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { profile, user, cards, comments, isLiked } = portfolioData;

  const totalValue = cards.reduce((sum, card) => sum + parseFloat(card.estimatedValue || "0"), 0);

  const sharePortfolio = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Portfolio link copied to clipboard",
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/community">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Community
            </Button>
          </Link>
          <Button onClick={sharePortfolio} variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share Portfolio
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="card-glass mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 ring-4 ring-blue-100">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                    {profile.displayName?.charAt(0) || user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    {profile.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous Collector'}
                  </h1>
                  {profile.bio && (
                    <p className="text-slate-600 mb-4 max-w-2xl">{profile.bio}</p>
                  )}
                  <div className="flex items-center space-x-6 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4" />
                      <span>{profile.likeCount || 0} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{profile.viewCount || 0} views</span>
                    </div>
                    <Badge variant="secondary" className="gradient-primary text-white border-0">
                      Public Portfolio
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-3xl font-bold text-slate-800">${totalValue.toLocaleString()}</p>
                <p className="text-slate-500 text-sm">{cards.length} cards</p>
                {currentUser && (
                  <Button
                    onClick={() => likeMutation.mutate()}
                    disabled={likeMutation.isPending}
                    variant={isLiked ? "default" : "outline"}
                    className={`mt-4 ${isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Card Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cards.map((card) => (
              <Card key={card.id} className="card-glass hover:scale-105 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="aspect-[2.5/3.5] mb-4 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={card.imageUrl || "https://images.pokemontcg.io/base1/4.png"}
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-2">{card.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{card.condition}</Badge>
                    <span className="font-bold text-green-600">${card.estimatedValue}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment */}
            {currentUser && (
              <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || commentMutation.isPending}
                  size="sm"
                >
                  {commentMutation.isPending ? "Adding..." : "Add Comment"}
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.commenterImage || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                      {comment.commenterName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-800 text-sm">{comment.commenterName}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                        {currentUser && currentUser.id === comment.commenterUserId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCommentMutation.mutate(comment.id)}
                            disabled={deleteCommentMutation.isPending}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="text-slate-500 text-center py-8">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}