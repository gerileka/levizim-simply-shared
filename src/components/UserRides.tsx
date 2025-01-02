import { useEffect, useState } from "react";
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
  bookings?: {
    id: string;
    status: string;
    user: {
      name: string;
      avatar_url: string | null;
    };
  }[];
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
        .select(`
          *,
          bookings (
            id,
            status,
            user:user_id (
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

      // Refresh rides to show updated status
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

                {/* Booking Requests Section */}
                {ride.bookings && ride.bookings.length > 0 && (
                  <div className="mt-4 border-t border-stripe-muted pt-4">
                    <h3 className="text-sm font-semibold text-stripe-text mb-2">Booking Requests</h3>
                    <div className="space-y-3">
                      {ride.bookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between bg-stripe-bg p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <img
                              src={booking.user.avatar_url || '/placeholder.svg'}
                              alt={booking.user.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm text-stripe-text">{booking.user.name}</span>
                          </div>
                          {booking.status === 'pending' ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleBookingStatusChange(booking.id, 'accepted')}
                                className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleBookingStatusChange(booking.id, 'rejected')}
                                className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded ${
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};