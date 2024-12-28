import { motion } from "framer-motion";
import { ArrowRight, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const Hero = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for ride:", { fromLocation, toLocation, date });
  };

  const handleOffer = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Offering ride:", { fromLocation, toLocation, date });
  };

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
                  <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="from-search">From</Label>
                        <Input
                          id="from-search"
                          placeholder="Enter departure city"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-search">To</Label>
                        <Input
                          id="to-search"
                          placeholder="Enter destination city"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-search">Date</Label>
                        <Input
                          id="date-search"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
                      Search Rides
                      <Search className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="offer">
                  <form onSubmit={handleOffer} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="from-offer">From</Label>
                        <Input
                          id="from-offer"
                          placeholder="Enter departure city"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-offer">To</Label>
                        <Input
                          id="to-offer"
                          placeholder="Enter destination city"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-offer">Date</Label>
                        <Input
                          id="date-offer"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
                      Offer Ride
                      <Car className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};