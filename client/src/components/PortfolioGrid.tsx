import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Download, BarChart3, Eye, Trash2, Grid3X3, List, Loader2, Edit, ExternalLink } from "lucide-react";
import EditCardDialog from "./EditCardDialog";
import { useState, useEffect } from "react";
import type { Card as CardType } from "@shared/schema";

interface PortfolioGridProps {
  onCardSelect?: (cardName: string) => void;
  selectedCard?: string;
}

export default function PortfolioGrid({ onCardSelect, selectedCard }: PortfolioGridProps = {}) {
  const [setFilter, setSetFilter] = useState<string>("all");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Handle authentication errors globally for this component
  const handleAuthError = (error: Error) => {
    if (isUnauthorizedError(error)) {
      toast({
        title: "Session Expired",
        description: "Redirecting to login...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  };

  const { data: cards = [], isLoading } = useQuery<CardType[]>({
    queryKey: ['/api/cards'],
    retry: false,
  });

  const { data: portfolioStats } = useQuery<{
    totalCards: number;
    totalValue: string;
    avgValue: string;
    topCard: string;
  }>({
    queryKey: ['/api/portfolio/stats'],
    retry: false,
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (cardId: string) => {
      await apiRequest("DELETE", `/api/cards/${cardId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/stats'] });
      toast({
        title: "Card removed",
        description: "Card has been removed from your portfolio.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove card",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const filteredCards = cards.filter((card) => {
    const setMatch = setFilter === "all" || card.set === setFilter;
    const conditionMatch = conditionFilter === "all" || card.condition === conditionFilter;
    return setMatch && conditionMatch;
  });

  const uniqueSets = Array.from(new Set(cards.map((card) => card.set)));
  const uniqueConditions = Array.from(new Set(cards.map((card) => card.condition)));

  const generateTCGPlayerURL = (cardName: string, setName: string) => {
    const encodedName = encodeURIComponent(cardName);
    return `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${encodedName}&view=grid&productTypeName=Cards`;
  };

  const generatePokemonOfficialURL = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName);
    return `https://www.pokemon.com/us/pokemon-tcg/pokemon-cards`;
  };

  const getConditionColor = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('mint')) return 'bg-green-100 text-green-800';
    if (conditionLower.includes('excellent')) return 'bg-yellow-100 text-yellow-800';
    if (conditionLower.includes('good')) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">My Portfolio</h2>
            <p className="text-gray-600 mt-1">
              {portfolioStats?.totalCards || 0} cards • Total value: ${portfolioStats?.totalValue || "0.00"}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="bg-primary hover:bg-blue-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border-b border-slate-200/50">
        <div className="stats-card">
          <p className="stats-value">{portfolioStats?.totalCards || 0}</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Total Cards</p>
        </div>
        <div className="stats-card">
          <p className="stats-value">${portfolioStats?.totalValue || "0.00"}</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Portfolio Value</p>
        </div>
        <div className="stats-card">
          <p className="stats-value">${portfolioStats?.topCard || "0.00"}</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Most Valuable</p>
        </div>
        <div className="stats-card">
          <p className="stats-value">${portfolioStats?.avgValue || "0.00"}</p>
          <p className="text-sm text-slate-500 font-medium mt-1">Average Value</p>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <Select value={setFilter} onValueChange={setSetFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Sets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sets</SelectItem>
                {uniqueSets.map((set) => (
                  <SelectItem key={set} value={set}>
                    {set}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Conditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {uniqueConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cards found</p>
            <p className="text-gray-400">Start by scanning your first Pokemon card!</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
            "space-y-4"
          }>
            {filteredCards.map((card) => (
              <Card 
                key={card.id} 
                className={`collectr-card cursor-pointer ${
                  selectedCard === card.name 
                    ? 'ring-2 ring-blue-500 shadow-xl scale-105' 
                    : ''
                }`}
                onClick={() => {
                  // Navigate to card details page
                  window.location.href = `/card/${encodeURIComponent(card.name)}`;
                }}
              >
                {viewMode === 'grid' ? (
                  <>
                    {card.imageUrl && (
                      <img
                        src={card.imageUrl}
                        alt={`${card.name} Pokemon card`}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-800 mb-1 text-sm">{card.name}</h3>
                      <p className="text-xs text-slate-500 mb-3">{card.set} • {card.cardNumber}</p>
                      <div className="flex justify-between items-center mb-3">
                        <Badge className={`${getConditionColor(card.condition)} text-xs font-medium`}>
                          {card.condition}
                        </Badge>
                        <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          ${parseFloat(card.estimatedValue).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <EditCardDialog card={card}>
                          <Button variant="outline" size="sm" className="flex-1 text-xs border-slate-200 hover:bg-blue-50" onClick={(e) => e.stopPropagation()}>
                            <Edit className="mr-1 h-3 w-3" />
                            Edit
                          </Button>
                        </EditCardDialog>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs border-slate-200 hover:bg-emerald-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(generateTCGPlayerURL(card.name, card.set), '_blank');
                          }}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          TCG
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCardMutation.mutate(card.id);
                          }}
                          disabled={deleteCardMutation.isPending}
                          className="text-red-500 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      {card.imageUrl && (
                        <img
                          src={card.imageUrl}
                          alt={`${card.name} Pokemon card`}
                          className="w-16 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{card.name}</h3>
                        <p className="text-sm text-gray-600">{card.set} • {card.cardNumber}</p>
                        <Badge className={getConditionColor(card.condition)}>
                          {card.condition}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${parseFloat(card.estimatedValue).toFixed(2)}</p>
                        <div className="flex space-x-1 mt-2">
                          <EditCardDialog card={card}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </EditCardDialog>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(generateTCGPlayerURL(card.name, card.set), '_blank')}
                            title="View on TCGPlayer"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteCardMutation.mutate(card.id)}
                            disabled={deleteCardMutation.isPending}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
