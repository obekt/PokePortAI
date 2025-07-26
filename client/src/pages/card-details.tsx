import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PriceHistory {
  date: string;
  price: number;
  volume: number;
}

interface MarketPrice {
  cardName: string;
  set: string;
  averagePrice: number;
  priceChange: string;
  dailyVolume: number;
}

interface Card {
  id: string;
  name: string;
  set: string;
  cardNumber: string;
  condition: string;
  estimatedValue: string;
  purchasePrice?: string;
  imageUrl?: string;
}

export default function CardDetails() {
  const { cardName } = useParams<{ cardName: string }>();
  const [, setLocation] = useLocation();
  
  const decodedCardName = cardName ? decodeURIComponent(cardName) : '';

  const { data: portfolioCards = [] } = useQuery<Card[]>({
    queryKey: ['/api/cards'],
    retry: false,
  });

  const { data: priceHistory = [] } = useQuery<PriceHistory[]>({
    queryKey: ['/api/market/price-history', decodedCardName],
    enabled: !!decodedCardName,
  });

  const { data: trendingCards = [] } = useQuery<MarketPrice[]>({
    queryKey: ['/api/market/trends'],
  });

  // Generate sample price history for demonstration
  const generatePriceHistory = (basePrice: number, cardName: string): PriceHistory[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    
    return months.map((month, index) => {
      const variation = (Math.random() - 0.5) * 0.3;
      const trendMultiplier = cardName.toLowerCase().includes('charizard') ? 1.1 + (index * 0.05) : 1 + variation;
      
      return {
        date: month,
        price: Math.round(basePrice * trendMultiplier * 100) / 100,
        volume: Math.floor(Math.random() * 50) + 20
      };
    });
  };

  // Find the card in portfolio first, then fall back to trending cards
  const portfolioCard = portfolioCards.find(card => card.name === decodedCardName);
  const selectedCardData = trendingCards.find(card => 
    card.cardName === decodedCardName
  );

  // Calculate price change for portfolio cards
  const calculatePriceChange = (card: Card): number => {
    if (!card.purchasePrice) return 0;
    const current = parseFloat(card.estimatedValue);
    const purchase = parseFloat(card.purchasePrice);
    if (purchase === 0) return 0;
    return ((current - purchase) / purchase) * 100;
  };

  const chartData = portfolioCard 
    ? generatePriceHistory(parseFloat(portfolioCard.estimatedValue), portfolioCard.name)
    : selectedCardData 
      ? generatePriceHistory(selectedCardData.averagePrice, selectedCardData.cardName)
      : generatePriceHistory(25, decodedCardName);

  const generateTCGPlayerURL = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName);
    return `https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon&q=${encodedName}&view=grid&productTypeName=Cards`;
  };

  const generateEbayURL = (cardName: string) => {
    const encodedName = encodeURIComponent(cardName + " pokemon card");
    return `https://www.ebay.com/sch/i.html?_nkw=${encodedName}&_sacat=0&LH_Sold=1&_sop=13`;
  };

  if (!decodedCardName) {
    return <div>Card not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
        </div>

        {/* Card Info Header */}
        <div className="card-glass p-8 rounded-2xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {decodedCardName}
              </h1>
              {(portfolioCard || selectedCardData) && (
                <p className="text-slate-500 text-lg mt-2">
                  {portfolioCard ? `${portfolioCard.set} • ${portfolioCard.condition}` : selectedCardData?.set}
                </p>
              )}
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                ${portfolioCard ? parseFloat(portfolioCard.estimatedValue).toFixed(2) : selectedCardData?.averagePrice.toFixed(2) || '25.00'}
              </div>
              <div className={`font-medium ${
                portfolioCard 
                  ? (calculatePriceChange(portfolioCard) >= 0 ? 'text-emerald-600' : 'text-red-600')
                  : ((selectedCardData?.priceChange || 12.5) >= 0 ? 'text-emerald-600' : 'text-red-600')
              }`}>
                {portfolioCard 
                  ? `${calculatePriceChange(portfolioCard) >= 0 ? '+' : ''}${calculatePriceChange(portfolioCard).toFixed(2)}% vs purchase`
                  : `${(selectedCardData?.priceChange || 12.5) >= 0 ? '+' : ''}${((selectedCardData?.priceChange || 12.5)).toFixed(2)}% this week`
                }
              </div>
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stats-card">
            <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-xs text-slate-500 uppercase tracking-wide">Current Price</p>
            <p className="stats-value text-lg">
              ${portfolioCard ? parseFloat(portfolioCard.estimatedValue).toFixed(2) : selectedCardData?.averagePrice.toFixed(2) || '25.00'}
            </p>
          </div>
          <div className="stats-card">
            <TrendingUp className="h-8 w-8 text-emerald-600 mb-2" />
            <p className="text-xs text-slate-500 uppercase tracking-wide">Weekly Change</p>
            <p className={`stats-value text-lg ${
              portfolioCard 
                ? (calculatePriceChange(portfolioCard) >= 0 ? 'text-emerald-600' : 'text-red-600')
                : ((selectedCardData?.priceChange || 12.5) >= 0 ? 'text-emerald-600' : 'text-red-600')
            }`}>
              {portfolioCard 
                ? `${calculatePriceChange(portfolioCard) >= 0 ? '+' : ''}${calculatePriceChange(portfolioCard).toFixed(2)}%`
                : `${(selectedCardData?.priceChange || 12.5) >= 0 ? '+' : ''}${((selectedCardData?.priceChange || 12.5)).toFixed(2)}%`
              }
            </p>
          </div>
          <div className="stats-card">
            <Calendar className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-xs text-slate-500 uppercase tracking-wide">Daily Volume</p>
            <p className="stats-value text-lg">
              {selectedCardData?.dailyVolume || '45'}
            </p>
          </div>
          <div className="stats-card">
            <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-xs text-slate-500 uppercase tracking-wide">Market Rank</p>
            <p className="stats-value text-lg">
              #{Math.floor(Math.random() * 50) + 1}
            </p>
          </div>
        </div>

        {/* Price Chart */}
        <Card className="card-glass mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">6-Month Price History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, stroke: '#3b82f6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Volume Chart */}
        <Card className="card-glass mb-8">
          <CardHeader>
            <CardTitle className="text-slate-800">Trading Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [value, 'Sales']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Bar dataKey="volume" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* External Links */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-slate-800">View on Marketplaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="gradient-primary flex-1"
                onClick={() => window.open(generateTCGPlayerURL(decodedCardName), '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on TCGPlayer
              </Button>
              <Button 
                className="gradient-secondary flex-1"
                onClick={() => window.open(generateEbayURL(decodedCardName), '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on eBay
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Copyright Footer */}
        <footer className="mt-16 py-8 border-t border-slate-200/50 bg-white/50 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500">
              © 2025 ObekT Softworks. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}