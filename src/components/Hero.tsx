import { motion } from "framer-motion";
import { Search, Car } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RideSearch } from "./RideSearch";
import { RideOffer } from "./RideOffer";

interface HeroProps {
  onSearchResults: (rides: any[]) => void;
}

export const Hero = ({ onSearchResults }: HeroProps) => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sage-50/50 to-white/95 -z-10" />
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Share Your Journey with
                <span className="text-sage-500"> LevizimBashke</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Connect with fellow travelers, share rides, and make your journey more sustainable and enjoyable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-[800px] mx-auto w-full mt-8"
            >
              <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="search" className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Find a Ride
                  </TabsTrigger>
                  <TabsTrigger value="offer" className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Offer a Ride
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="search">
                  <RideSearch onSearchResults={onSearchResults} />
                </TabsContent>

                <TabsContent value="offer">
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