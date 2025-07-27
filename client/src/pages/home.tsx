import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import CardScanner from "@/components/CardScanner";
import PortfolioGrid from "@/components/PortfolioGrid";
import TrendingCardsGrid from "@/components/TrendingCardsGrid";
import { Button } from "@/components/ui/button";
import { Camera, Folder, TrendingUp, Plus, Users, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "wouter";

export default function Home() {
  const [activeSection, setActiveSection] = useState<'scanner' | 'portfolio' | 'market'>('scanner');
  const [selectedCard, setSelectedCard] = useState<string>('');
  const isMobile = useIsMobile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Always update activeSection state for both mobile and desktop
    setActiveSection(sectionId as any);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader activeSection={activeSection} onNavigate={scrollToSection} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Scanner Section */}
        <section id="scanner" className="mb-12">
          <div className="card-glass p-8 rounded-2xl">
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

        {/* Market Overview Section */}
        <section id="market" className="mb-12">
          <div className="card-glass p-8 rounded-2xl">
            <div className="flex items-center mb-6">
              <div className="gradient-secondary p-3 rounded-xl mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Top Trending Cards
                </h2>
                <p className="text-slate-500 text-sm">Click any card to view detailed analytics and price history</p>
              </div>
            </div>
            <TrendingCardsGrid />
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="mb-12">
          <div className="card-glass p-8 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="gradient-secondary p-3 rounded-xl mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Community
                  </h2>
                  <p className="text-slate-500 text-sm">Connect with other Pokemon card collectors</p>
                </div>
              </div>
              <Link href="/community">
                <Button className="gradient-primary">
                  <Users className="h-4 w-4 mr-2" />
                  Explore Community
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Get Started</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Set up your public profile</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Make your portfolio public</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Connect with other collectors</span>
                  </div>
                </div>
                <Link href="/profile/settings">
                  <Button className="gradient-secondary w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Profile Settings
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Community Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Share your portfolio publicly</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Browse other collectors' cards</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Leave comments and get feedback</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Like and follow trending portfolios</span>
                  </div>
                </div>
              </div>
            </div>
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

      {/* Copyright Footer */}
      <footer className="mt-16 py-8 border-t border-slate-200/50 bg-white/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            © 2025 ObekT Softworks. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
