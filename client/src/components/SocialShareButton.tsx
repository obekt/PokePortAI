import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareButtonProps {
  portfolioStats: {
    totalCards: number;
    totalValue: string;
    topCard?: {
      name: string;
      value: string;
    };
  };
}

export default function SocialShareButton({ portfolioStats }: SocialShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `🔥 Check out my Pokemon card portfolio! 

📊 Collection Stats:
• ${portfolioStats.totalCards} cards
• Total value: $${portfolioStats.totalValue}
${portfolioStats.topCard ? `• Top card: ${portfolioStats.topCard.name} ($${portfolioStats.topCard.value})` : ''}

Built with Poke Port AI - the smart way to track your Pokemon cards! 💎

#PokemonCards #CardCollecting #PokePortAI`;

  const shareUrl = "https://poke-port-ai.obekt.com";
  
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&summary=${encodedText}`
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard!",
        description: "Your portfolio summary has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gradient-primary w-full sm:w-auto">
          <Share2 className="h-4 w-4 mr-2" />
          Share Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Your Pokemon Portfolio
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Preview Card */}
          <Card className="card-glass border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Portfolio Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Cards:</span>
                <span className="font-semibold">{portfolioStats.totalCards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Value:</span>
                <span className="font-semibold text-emerald-600">${portfolioStats.totalValue}</span>
              </div>
              {portfolioStats.topCard && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Top Card:</span>
                  <span className="font-semibold text-blue-600">{portfolioStats.topCard.name}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Social Media Buttons */}
          <div className="space-y-3">
            <p className="text-sm text-slate-600 font-medium">Share on social media:</p>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 border-blue-200"
                onClick={() => window.open(socialLinks.twitter, '_blank')}
              >
                <Twitter className="h-5 w-5 text-blue-500" />
                <span className="text-xs">Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 border-blue-200"
                onClick={() => window.open(socialLinks.facebook, '_blank')}
              >
                <Facebook className="h-5 w-5 text-blue-600" />
                <span className="text-xs">Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-auto py-3 gap-1 hover:bg-blue-50 border-blue-200"
                onClick={() => window.open(socialLinks.linkedin, '_blank')}
              >
                <Linkedin className="h-5 w-5 text-blue-700" />
                <span className="text-xs">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Copy to Clipboard */}
          <div className="space-y-2">
            <p className="text-sm text-slate-600 font-medium">Or copy to share anywhere:</p>
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Portfolio Summary
                </>
              )}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              Powered by Poke Port AI • Track, Analyze, Share
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}