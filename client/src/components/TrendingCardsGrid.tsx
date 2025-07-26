import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

interface MarketPrice {
  cardName: string;
  set: string;
  averagePrice: number;
  priceChange: string;
  dailyVolume: number;
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
          className="card-glass cursor-pointer"
          onClick={() => setLocation(`/card/${encodeURIComponent(card.cardName)}`)}
        >
          <CardContent className="p-4">
            <h4 className="font-semibold text-slate-800 text-sm mb-2">{card.cardName}</h4>
            <p className="text-xs text-slate-500 mb-2">{card.set}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                ${card.averagePrice.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-600 font-medium">
                +{card.priceChange}%
              </span>
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>Volume: {card.dailyVolume}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}