import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketPrice {
  cardName: string;
  set: string;
  condition: string;
  averagePrice: number;
  priceChange: number;
}

export default function MarketAnalysis() {
  const { data: trendingCards = [], isLoading } = useQuery({
    queryKey: ['/api/market/trends'],
  });

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-6">Market Analysis</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Price Trends Chart Placeholder */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Price Trends</h3>
            <div className="bg-gray-50 rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <TrendingUp className="h-16 w-16 mx-auto mb-4" />
                <p>Price trend chart would be displayed here</p>
                <p className="text-sm mt-2">Integration with charting library needed</p>
              </div>
            </div>
          </div>

          {/* Top Performing Cards */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Performing Cards</h3>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading market data...</p>
                </div>
              ) : trendingCards.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No market data available</p>
                </div>
              ) : (
                trendingCards.map((card: MarketPrice, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded mr-4 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {card.cardName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{card.cardName}</p>
                        <p className="text-sm text-gray-600">{card.set}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        {card.priceChange >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span 
                          className={`font-bold ${
                            card.priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {card.priceChange >= 0 ? '+' : ''}{card.priceChange.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        ${card.averagePrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
