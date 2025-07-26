import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, Lightbulb, Plus, Loader2 } from "lucide-react";

interface RecognitionResult {
  recognition: {
    name: string;
    set: string;
    cardNumber: string;
    condition: string;
    confidence: number;
    rarity?: string;
    type?: string;
  };
  marketPrice: {
    averagePrice: number;
    priceRange: { low: number; high: number };
    recentSales: number;
    priceChange: number;
  };
  imageUrl: string;
}

export default function CardScanner() {
  const [scanResult, setScanResult] = useState<RecognitionResult | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scanMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/cards/scan", formData);
      return response.json();
    },
    onSuccess: (data: RecognitionResult) => {
      setScanResult(data);
      setImagePreview(data.imageUrl);
      toast({
        title: "Card recognized successfully!",
        description: `Identified as ${data.recognition.name} from ${data.recognition.set}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Scanning failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const addToPortfolioMutation = useMutation({
    mutationFn: async (cardData: any) => {
      const response = await apiRequest("POST", "/api/cards", cardData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cards'] });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio/stats'] });
      toast({
        title: "Card added to portfolio!",
        description: "Your card has been successfully added to your collection.",
      });
      setScanResult(null);
      setImagePreview(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to add card",
        description: (error as Error).message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      scanMutation.mutate(formData);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan cards.",
        variant: "destructive",
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const formData = new FormData();
          formData.append('image', blob, 'capture.jpg');
          scanMutation.mutate(formData);
          stopCamera();
        }
      }, 'image/jpeg', 0.8);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const addToPortfolio = () => {
    if (scanResult) {
      const cardData = {
        name: scanResult.recognition.name,
        set: scanResult.recognition.set,
        cardNumber: scanResult.recognition.cardNumber,
        condition: scanResult.recognition.condition,
        estimatedValue: scanResult.marketPrice.averagePrice.toString(),
        imageUrl: scanResult.imageUrl,
        recognitionData: scanResult.recognition,
      };
      addToPortfolioMutation.mutate(cardData);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Camera/Upload Interface */}
      <div className="space-y-6">
        {!isCameraActive ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors bg-gray-50">
            <div className="mb-4">
              <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Scan or Upload Card</p>
              <p className="text-sm text-gray-600">Take a photo or upload an image of your Pokemon card</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={startCamera} className="bg-primary hover:bg-blue-700">
                <Camera className="mr-2 h-4 w-4" />
                Use Camera
              </Button>
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <Button onClick={capturePhoto} size="lg" className="bg-primary hover:bg-blue-700">
                <Camera className="mr-2 h-4 w-4" />
                Capture
              </Button>
              <Button onClick={stopCamera} variant="outline" size="lg">
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Scanning Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2 flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              Scanning Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ensure good lighting and focus</li>
              <li>• Place card on flat, contrasting surface</li>
              <li>• Include entire card in frame</li>
              <li>• Avoid glare and shadows</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Recognition Results */}
      <div className="space-y-6">
        {scanMutation.isPending && (
          <Card>
            <CardContent className="p-6 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="font-medium text-gray-900 mb-2">Analyzing Card...</p>
              <p className="text-sm text-gray-600">AI is identifying your Pokemon card</p>
            </CardContent>
          </Card>
        )}

        {scanResult && (
          <Card>
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4">
              <h3 className="font-medium">Recognition Result</h3>
            </div>
            <CardContent className="p-6">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Scanned Pokemon card"
                  className="w-32 h-44 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                />
              )}
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Card Name</label>
                  <p className="text-lg font-medium text-gray-900">{scanResult.recognition.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Set</label>
                    <p className="text-gray-900">{scanResult.recognition.set}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Card Number</label>
                    <p className="text-gray-900">{scanResult.recognition.cardNumber}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Condition</label>
                  <div className="flex items-center mt-1">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {scanResult.recognition.condition}
                    </Badge>
                    <span className="text-sm text-gray-600 ml-2">
                      ({Math.round(scanResult.recognition.confidence * 100)}% confidence)
                    </span>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Value</label>
                  <p className="text-2xl font-bold text-green-600">
                    ${scanResult.marketPrice.averagePrice.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">Based on recent sales data</p>
                </div>
              </div>
              
              <Button 
                onClick={addToPortfolio} 
                className="w-full mt-6 bg-primary hover:bg-blue-700"
                disabled={addToPortfolioMutation.isPending}
              >
                {addToPortfolioMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add to Portfolio
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
