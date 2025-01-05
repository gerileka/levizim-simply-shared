import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { RideCard } from "./rides/RideCard";
import { BookingRequests } from "./rides/BookingRequests";

interface OfferedRide {
  id: string;
  from_location: string;
  to_location: string;
  date: string;
  price: number;
  seats: number;
  bookings?: {
    id: string;
    status: string;
    user: {
      id: string;
      name: string;
      avatar_url: string | null;
    };
  }[];
}

export const UserRides = () => {
  const [offeredRides, setOfferedRides] = useState<OfferedRide[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
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
        .select(`
          *,
          bookings (
            id,
            status,
            user:profiles!bookings_user_id_fkey (
              id,
              name,
              avatar_url
            )
          )
        `)
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

  const handleBookingStatusChange = async (bookingId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      fetchOfferedRides();

      toast({
        title: `Booking ${newStatus}`,
        description: `You have ${newStatus} this booking request`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error updating booking",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .delete()
        .eq('id', rideId);

      if (error) throw error;

      setOfferedRides(rides => rides.filter(ride => ride.id !== rideId));
      toast({
        title: "Ride deleted",
        description: "Your ride has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting ride:', error);
      toast({
        title: "Error deleting ride",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center text-stripe-text">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-stripe-text mb-8">My Offers</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offeredRides.length === 0 ? (
          <p className="text-stripe-text/60 col-span-full">You haven't offered any rides yet.</p>
        ) : (
          offeredRides.map((ride) => (
            <Card key={ride.id} className="p-6 bg-stripe-secondary border-stripe-muted">
              <RideCard ride={ride} onDelete={handleDeleteRide} />
              <BookingRequests
                bookings={ride.bookings}
                onStatusChange={handleBookingStatusChange}
                selectedBooking={selectedBooking}
                setSelectedBooking={setSelectedBooking}
              />
            </Card>
          ))
        )}
      </div>
    </div>
  );
};