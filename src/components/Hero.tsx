import { motion } from "framer-motion";
import { Search, Car } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RideSearch } from "./RideSearch";
import { RideOffer } from "./RideOffer";
import { useState } from "react";

interface HeroProps {
  onSearchResults: (rides: any[]) => void;
}

export const Hero = ({ onSearchResults }: HeroProps) => {
  const [activeTab, setActiveTab] = useState("search");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "offer") {
      onSearchResults([]); // Clear search results when switching to offer tab
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-24 md:pt-8">
      <div className="absolute inset-0 bg-gradient-to-b from-stripe-bg to-stripe-muted -z-10" />
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-stripe-text">
                Share Your Journey with
                <span className="text-stripe-accent"> LevizimBashke</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-stripe-text/80 md:text-xl">
                Connect with fellow travelers, share rides, and make your journey more sustainable and enjoyable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-[800px] mx-auto w-full mt-8"
            >
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-stripe-secondary h-auto p-0 rounded-lg overflow-hidden">
                  <TabsTrigger 
                    value="search" 
                    className="flex items-center justify-center gap-2 data-[state=active]:bg-stripe-accent py-4 text-base w-full h-full"
                  >
                    <Search className="w-5 h-5" />
                    Find a Ride
                  </TabsTrigger>
                  <TabsTrigger 
                    value="offer" 
                    className="flex items-center justify-center gap-2 data-[state=active]:bg-stripe-accent py-4 text-base w-full h-full"
                  >
                    <Car className="w-5 h-5" />
                    Offer a Ride
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search" className="space-y-8">
                  <RideSearch onSearchResults={onSearchResults} />
                </TabsContent>

                <TabsContent value="offer" className="space-y-8">
                  <RideOffer />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};