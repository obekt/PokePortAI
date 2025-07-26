import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Camera, UserCircle, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";

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
    avgValue: string;
    topCard: string;
  }>({
    queryKey: ['/api/portfolio/stats'],
    retry: false,
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Camera className="text-primary h-6 w-6 mr-3" />
            <h1 className="text-xl font-medium text-gray-900">Poke Port AI</h1>
          </div>
          
          {!isMobile && (
            <nav className="flex space-x-8">
              <Button
                variant="ghost"
                className={`${
                  activeSection === 'scanner'
                    ? 'text-primary font-medium border-b-2 border-primary pb-1 rounded-none'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => onNavigate('scanner')}
              >
                Scanner
              </Button>
              <Button
                variant="ghost"
                className={`${
                  activeSection === 'portfolio'
                    ? 'text-primary font-medium border-b-2 border-primary pb-1 rounded-none'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => onNavigate('portfolio')}
              >
                Portfolio
              </Button>
              <Button
                variant="ghost"
                className={`${
                  activeSection === 'market'
                    ? 'text-primary font-medium border-b-2 border-primary pb-1 rounded-none'
                    : 'text-gray-600 hover:text-primary'
                }`}
                onClick={() => onNavigate('market')}
              >
                Market
              </Button>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Portfolio Value:{" "}
              <span className="font-medium text-green-600">
                ${portfolioStats?.totalValue || "0.00"}
              </span>
            </span>
            
            {user && (
              <div className="flex items-center space-x-2">
                {(user as any).profileImageUrl && (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="text-sm hidden sm:block">
                  <p className="font-medium text-gray-900">
                    {(user as any).firstName || (user as any).email?.split('@')[0] || 'User'}
                  </p>
                </div>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.href = "/api/logout"}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
