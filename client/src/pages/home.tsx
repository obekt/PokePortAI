import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import CardScanner from "@/components/CardScanner";
import PortfolioGrid from "@/components/PortfolioGrid";
import PriceTrendsChart from "@/components/PriceTrendsChart";
import { Button } from "@/components/ui/button";
import { Camera, Folder, TrendingUp, Plus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'scanner' | 'portfolio' | 'market'>('scanner');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isMobile) {
      setActiveSection(sectionId as any);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader activeSection={activeSection} onNavigate={scrollToSection} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Scanner Section */}
        <section id="scanner" className="mb-12">
          <div className="collectr-card p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="gradient-primary p-3 rounded-xl mr-4">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Scan Pokemon Card
                </h2>
                <p className="text-slate-500 text-sm">AI-powered card recognition with instant market value</p>
              </div>
            </div>
            <CardScanner />
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="mb-12">
          <PortfolioGrid 
            selectedCard={selectedCard}
            onCardSelect={setSelectedCard}
          />
        </section>

        {/* Market Analysis Section */}
        <section id="market" className="mb-12">
          <div className="collectr-card p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="gradient-secondary p-3 rounded-xl mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Market Trends & Analysis
                </h2>
                <p className="text-slate-500 text-sm">Real-time pricing and trend analysis for Pokemon cards</p>
              </div>
            </div>
            <PriceTrendsChart 
              selectedCard={selectedCard} 
              onCardSelect={setSelectedCard}
            />
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-40">
          <div className="grid grid-cols-3 h-16">
            <Button
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full rounded-none ${
                activeSection === 'scanner'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600'
              }`}
              onClick={() => scrollToSection('scanner')}
            >
              <Camera className="h-5 w-5" />
              <span className="text-xs font-medium mt-1">Scanner</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full rounded-none ${
                activeSection === 'portfolio'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600'
              }`}
              onClick={() => scrollToSection('portfolio')}
            >
              <Folder className="h-5 w-5" />
              <span className="text-xs mt-1">Portfolio</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex flex-col items-center justify-center h-full rounded-none ${
                activeSection === 'market'
                  ? 'text-primary border-t-2 border-primary'
                  : 'text-gray-600'
              }`}
              onClick={() => scrollToSection('market')}
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-xs mt-1">Market</span>
            </Button>
          </div>
        </nav>
      )}

      {/* Floating Action Button */}
      {isMobile && (
        <Button
          className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg z-30"
          onClick={() => scrollToSection('scanner')}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
