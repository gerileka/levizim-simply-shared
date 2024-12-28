import { motion } from "framer-motion";
import { ArrowRight, Search, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const Hero = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*, profiles(full_name, avatar_url, rating)')
        .eq('from_location', fromLocation)
        .eq('to_location', toLocation)
        .eq('date', date)
        .gt('seats', 0);

      if (error) throw error;

      console.log('Found rides:', data);
      // Here you could navigate to a search results page or update state to show results
      toast({
        title: `Found ${data.length} rides`,
        description: "Scroll down to see available rides",
      });
    } catch (error) {
      console.error('Error searching rides:', error);
      toast({
        title: "Error searching rides",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to offer a ride",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('rides')
        .insert([
          {
            driver_id: user.id,
            from_location: fromLocation,
            to_location: toLocation,
            date,
            price: parseFloat(price),
            seats: parseInt(seats),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ride offered successfully",
        description: "Your ride has been posted",
      });

      // Clear form
      setFromLocation("");
      setToLocation("");
      setDate("");
      setPrice("");
      setSeats("");
    } catch (error) {
      console.error('Error offering ride:', error);
      toast({
        title: "Error offering ride",
        description: "Please try again later",
        variant: "destructive",
      });
    }
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
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="to-offer">To</Label>
                        <Input
                          id="to-offer"
                          placeholder="Enter destination city"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date-offer">Date</Label>
                        <Input
                          id="date-offer"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          type="number"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seats">Available Seats</Label>
                        <Input
                          id="seats"
                          type="number"
                          placeholder="Enter number of seats"
                          value={seats}
                          onChange={(e) => setSeats(e.target.value)}
                          required
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