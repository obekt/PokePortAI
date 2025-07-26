import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

interface MarketPrice {
  cardName: string;
  set: string;
  averagePrice: number;
  priceChange: number;
  recentSales: number;
  imageUrl?: string;
}

export default function TrendingCardsGrid() {
  const [, setLocation] = useLocation();
  
  const { data: trendingCards = [], isLoading } = useQuery<MarketPrice[]>({
    queryKey: ['/api/market/trends'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="card-glass animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-2"></div>
              <div className="h-6 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {trendingCards.map((card) => (
        <Card 
          key={card.cardName} 
          className="card-glass cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => setLocation(`/card/${encodeURIComponent(card.cardName)}`)}
        >
          {card.imageUrl && (
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={card.imageUrl}
                alt={`${card.cardName} Pokemon card`}
                className="w-full h-32 object-cover hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  // Hide image container if image fails to load
                  e.currentTarget.parentElement!.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">{card.cardName}</h4>
            <p className="text-xs text-slate-500 mb-2">{card.set}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                ${card.averagePrice.toFixed(2)}
              </span>
              <span className={`text-xs font-medium ${
                card.priceChange >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {card.priceChange >= 0 ? '+' : ''}{card.priceChange.toFixed(2)}%
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Sales: {card.recentSales}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}