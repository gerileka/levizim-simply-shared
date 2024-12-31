import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  ride: {
    from_location: string;
    to_location: string;
    date: string;
    price: number;
    seats: number;
    driver: {
      name: string;
      rating: number;
      avatar_url: string;
    };
  };
  status: string;
}

export const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          ride:rides (
            from_location,
            to_location,
            date,
            price,
            seats,
            driver:profiles (
              name,
              rating,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error fetching bookings",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(bookings.filter(booking => booking.id !== bookingId));
      toast({
        title: "Booking cancelled",
        description: "Your booking has been cancelled successfully",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error cancelling booking",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center text-stripe-text">Loading bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-stripe-text">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-stripe-text/60">You haven't made any bookings yet.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {bookings.map((booking) => (
            <Card key={booking.id} className="bg-stripe-secondary border-stripe-muted">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={booking.ride.driver.avatar_url || '/placeholder.svg'}
                      alt={booking.ride.driver.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-stripe-text">
                        {booking.ride.driver.name}
                      </h3>
                      <div className="text-sm text-stripe-text/60">
                        ★ {booking.ride.driver.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => cancelBooking(booking.id)}
                    className="text-stripe-text/60 hover:text-stripe-text"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-stripe-text/80">
                    <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
                    {booking.ride.from_location}
                  </div>
                  <div className="flex items-center text-stripe-text/80">
                    <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
                    {booking.ride.to_location}
                  </div>
                  <div className="flex items-center text-stripe-text/80">
                    <Calendar className="h-4 w-4 mr-2 text-stripe-accent" />
                    {new Date(booking.ride.date).toLocaleDateString()}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-stripe-text/60">Status: {booking.status}</span>
                    <span className="text-lg font-semibold text-stripe-accent">
                      ${booking.ride.price}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
};