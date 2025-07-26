// This service would typically integrate with external APIs like TCGPlayer, eBay, or PokemonPrices
// For now, we'll simulate market data based on card recognition

export interface MarketPrice {
  cardName: string;
  set: string;
  condition: string;
  averagePrice: number;
  priceRange: {
    low: number;
    high: number;
  };
  recentSales: number;
  priceChange: number; // percentage
}

export async function getMarketPrice(cardName: string, set: string, condition: string): Promise<MarketPrice> {
  // This would normally make API calls to pricing services
  // For demonstration, we'll use a pricing algorithm based on card popularity and condition
  
  const basePrice = calculateBasePrice(cardName, set);
  const conditionMultiplier = getConditionMultiplier(condition);
  const averagePrice = basePrice * conditionMultiplier;
  
  return {
    cardName,
    set,
    condition,
    averagePrice: Math.round(averagePrice * 100) / 100,
    priceRange: {
      low: Math.round(averagePrice * 0.7 * 100) / 100,
      high: Math.round(averagePrice * 1.3 * 100) / 100,
    },
    recentSales: Math.floor(Math.random() * 50) + 10,
    priceChange: (Math.random() - 0.5) * 20, // -10% to +10%
  };
}

function calculateBasePrice(cardName: string, set: string): number {
  // Pricing logic based on card rarity and popularity
  const cardLower = cardName.toLowerCase();
  const setLower = set.toLowerCase();
  
  let basePrice = 5; // Default base price
  
  // Premium cards
  if (cardLower.includes('charizard')) basePrice = 150;
  else if (cardLower.includes('blastoise')) basePrice = 80;
  else if (cardLower.includes('venusaur')) basePrice = 70;
  else if (cardLower.includes('pikachu')) basePrice = 25;
  else if (cardLower.includes('alakazam')) basePrice = 30;
  else if (cardLower.includes('mewtwo')) basePrice = 45;
  else if (cardLower.includes('mew')) basePrice = 40;
  
  // Set multipliers
  if (setLower.includes('base set')) basePrice *= 2.5;
  else if (setLower.includes('jungle')) basePrice *= 1.8;
  else if (setLower.includes('fossil')) basePrice *= 1.6;
  else if (setLower.includes('shadowless')) basePrice *= 3.0;
  else if (setLower.includes('1st edition')) basePrice *= 4.0;
  
  return basePrice;
}

function getConditionMultiplier(condition: string): number {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('mint')) return 1.0;
  if (conditionLower.includes('near mint')) return 0.85;
  if (conditionLower.includes('excellent')) return 0.7;
  if (conditionLower.includes('good')) return 0.5;
  if (conditionLower.includes('fair')) return 0.3;
  if (conditionLower.includes('poor')) return 0.15;
  
  return 0.7; // Default for unknown condition
}

export async function getTrendingCards(): Promise<MarketPrice[]> {
  const trendingCardData = [
    { name: "Charizard", set: "Base Set", condition: "Near Mint" },
    { name: "Pikachu Illustrator", set: "Promo", condition: "Mint" },
    { name: "Blastoise", set: "Base Set", condition: "Excellent" },
    { name: "Venusaur", set: "Base Set", condition: "Near Mint" },
    { name: "Alakazam", set: "Base Set", condition: "Mint" }
  ];
  
  return Promise.all(
    trendingCardData.map(card => getMarketPrice(card.name, card.set, card.condition))
  );
}
