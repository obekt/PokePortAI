import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Camera, UserCircle, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import TradingCardLogo from "./TradingCardLogo";

interface AppHeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function AppHeader({ activeSection, onNavigate }: AppHeaderProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: portfolioStats } = useQuery<{
    totalCards: number;
    totalValue: string;
    priceChange: string;
    topCard: string;
  }>({
    queryKey: ['/api/portfolio/stats'],
    retry: false,
  });

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <TradingCardLogo size={32} className="mr-3" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Poke Port AI
            </h1>
          </div>
          
          {!isMobile && (
            <nav className="flex space-x-2">
              <Button
                variant="ghost"
                className={`nav-item ${
                  activeSection === 'scanner'
                    ? 'active bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => onNavigate('scanner')}
              >
                Scanner
              </Button>
              <Button
                variant="ghost"
                className={`nav-item ${
                  activeSection === 'portfolio'
                    ? 'active bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => onNavigate('portfolio')}
              >
                Portfolio
              </Button>
              <Button
                variant="ghost"
                className={`nav-item ${
                  activeSection === 'market'
                    ? 'active bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => onNavigate('market')}
              >
                Market
              </Button>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block stats-card py-2 px-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Portfolio</p>
              <p className="stats-value text-lg">
                ${portfolioStats?.totalValue || "0.00"}
              </p>
            </div>
            
            {user && (
              <div className="flex items-center space-x-3 bg-white/50 rounded-xl px-3 py-2 border border-slate-200">
                {(user as any).profileImageUrl && (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-100"
                  />
                )}
                <div className="text-sm hidden sm:block">
                  <p className="font-semibold text-slate-800">
                    {(user as any).firstName || (user as any).email?.split('@')[0] || 'User'}
                  </p>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = "/api/logout"}
              className="gradient-secondary border-0 hover:scale-105 transition-transform"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
