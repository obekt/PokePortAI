import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scan, TrendingUp, ShieldCheck, Camera } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Poke Port AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            AI-powered Pokemon card recognition and portfolio management with real-time market analysis
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            onClick={() => {
              console.log("Redirecting to login...");
              try {
                window.location.href = "/api/login";
              } catch (error) {
                console.error("Login redirect failed:", error);
                alert("Login redirect failed. Please try refreshing the page.");
              }
            }}
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Camera className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <CardTitle>AI Card Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Scan Pokemon cards with AI-powered recognition using your camera or uploaded images
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Scan className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <CardTitle>Portfolio Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your entire Pokemon card collection with detailed information and valuations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time market prices and trends from TCGPlayer and Pokemon TCG API
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ShieldCheck className="w-12 h-12 mx-auto text-orange-600 mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your collection data is securely stored and only accessible to you
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Scan Your Cards
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use your camera or upload images of your Pokemon cards for instant AI recognition
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Get Market Value
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automatically fetch current market prices and trends from trusted sources
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Track Portfolio
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build and manage your collection with detailed analytics and insights
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Start Building Your Portfolio?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of collectors using PokéScan to manage their Pokemon card collections
            </p>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => window.location.href = "/api/login"}
            >
              Sign In to Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}