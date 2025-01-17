import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChatPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          ride:rides (
            from_location,
            to_location,
            date,
            driver:profiles!rides_driver_id_fkey (
              name,
              avatar_url
            )
          ),
          rider:profiles!bookings_user_id_fkey (
            name,
            avatar_url
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;
      setBooking(data);
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-4">Booking not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-stripe-bg">
      <div className="flex items-center p-4 border-b border-stripe-muted">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">
            {booking.ride.from_location} → {booking.ride.to_location}
          </h1>
          <p className="text-sm text-stripe-text/60">
            {new Date(booking.ride.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          bookingId={bookingId!}
          currentUserId={booking.user_id}
          isDriver={false}
          status={booking.status}
        />
      </div>
    </div>
  );
};

export default ChatPage;