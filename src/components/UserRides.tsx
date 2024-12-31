import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyBookings } from "./MyBookings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";

interface OfferedRide {
  id: string;
  from_location: string;
  to_location: string;
  date: string;
  price: number;
  seats: number;
}

export const UserRides = () => {
  const [offeredRides, setOfferedRides] = useState<OfferedRide[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOfferedRides();
  }, []);

  const fetchOfferedRides = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setOfferedRides(data || []);
    } catch (error) {
      console.error('Error fetching offered rides:', error);
      toast({
        title: "Error fetching rides",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-stripe-text">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="offers">My Offers</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <MyBookings />
        </TabsContent>

        <TabsContent value="offers">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offeredRides.length === 0 ? (
              <p className="text-stripe-text/60 col-span-full">You haven't offered any rides yet.</p>
            ) : (
              offeredRides.map((ride) => (
                <Card key={ride.id} className="p-6 bg-stripe-secondary border-stripe-muted">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-stripe-text/80">
                      <MapPin className="h-5 w-5 text-stripe-accent" />
                      <span>{ride.from_location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-stripe-text/80">
                      <MapPin className="h-5 w-5 text-stripe-accent" />
                      <span>{ride.to_location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-stripe-text/80">
                      <Calendar className="h-5 w-5 text-stripe-accent" />
                      <span>{new Date(ride.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-stripe-text/60">{ride.seats} seats available</span>
                      <span className="text-lg font-semibold text-stripe-accent">${ride.price}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};