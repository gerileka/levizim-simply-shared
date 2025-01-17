import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RideOffer } from "./RideOffer";
import { RideCard } from "./rides/RideCard";
import { BookingRequests } from "./rides/BookingRequests";

export const UserRides = () => {
  const [rides, setRides] = useState<any[]>([]);
  const [selectedRide, setSelectedRide] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRides = async () => {
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
            driver_accepted,
            rider_accepted,
            user:profiles (
              id,
              name,
              avatar_url
            )
          )
        `)
        .eq('driver_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;
      setRides(data || []);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast({
        title: "Error fetching rides",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleBookingStatusChange = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: status === 'accepted' ? 'pending' : 'rejected',
          driver_accepted: status === 'accepted'
        })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: `Booking ${status}`,
        description: status === 'accepted' 
          ? "Waiting for rider confirmation" 
          : "Booking has been rejected",
      });

      fetchRides();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error updating booking",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <div className="space-y-6">
      <RideOffer onRideCreated={fetchRides} />
      <div className="grid gap-4">
        {rides.map((ride) => (
          <div key={ride.id} className="space-y-4">
            <RideCard
              ride={ride}
              onClick={() => setSelectedRide(selectedRide === ride.id ? null : ride.id)}
              selected={selectedRide === ride.id}
            />
            {selectedRide === ride.id && (
              <BookingRequests
                bookings={ride.bookings}
                onStatusChange={handleBookingStatusChange}
                selectedBooking={null}
                setSelectedBooking={() => {}}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};