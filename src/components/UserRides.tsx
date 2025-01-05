import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Calendar, MapPin, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "./chat/ChatInterface";

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
              <div className="space-y-4">
                <div className="flex justify-between items-start">
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
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteRide(ride.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-stripe-text/60">{ride.seats} seats available</span>
                  <span className="text-lg font-semibold text-stripe-accent">${ride.price}</span>
                </div>

                {ride.bookings && ride.bookings.length > 0 && (
                  <div className="mt-4 border-t border-stripe-muted pt-4">
                    <h3 className="text-sm font-semibold text-stripe-text mb-2">Booking Requests</h3>
                    <div className="space-y-3">
                      {ride.bookings.map((booking) => (
                        <div key={booking.id} className="bg-stripe-bg p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <img
                                src={booking.user.avatar_url || '/placeholder.svg'}
                                alt={booking.user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <span className="text-sm text-stripe-text">{booking.user.name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                                className="text-stripe-text/60 hover:text-stripe-text"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                              {booking.status === 'pending' && (
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => handleBookingStatusChange(booking.id, 'accepted')}
                                    className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    onClick={() => handleBookingStatusChange(booking.id, 'rejected')}
                                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                                  >
                                    Reject
                                  </Button>
                                </div>
                              )}
                              <span className={`text-xs px-2 py-1 rounded ${
                                booking.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          {selectedBooking === booking.id && (
                            <div className="mt-4">
                              <ChatInterface
                                bookingId={booking.id}
                                currentUserId={booking.user.id}
                                onStatusChange={(status) => handleBookingStatusChange(booking.id, status)}
                                isDriver={true}
                                status={booking.status}
                              />
                            </div>
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