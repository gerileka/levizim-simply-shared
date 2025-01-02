import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BookingCard } from "./bookings/BookingCard";

interface Booking {
  id: string;
  ride: {
    from_location: string;
    to_location: string;
    date: string;
    price: number;
    seats: number;
    driver: {
      id: string;  // Added this line to include the driver's id
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

    // Set up real-time subscription
    const subscription = supabase
      .channel('bookings_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          console.log('Booking changed, refreshing...');
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Fetching bookings for user:', user.id);

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
              id,
              name,
              rating,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        throw error;
      }

      console.log('Fetched bookings:', data);
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
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={cancelBooking}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};