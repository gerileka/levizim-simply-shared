import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, MessageCircle, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BookingCardProps {
  booking: {
    id: string;
    ride: {
      from_location: string;
      to_location: string;
      date: string;
      price: number;
      seats: number;
      driver: {
        id: string;
        name: string;
        rating: number;
        avatar_url: string;
      };
    };
    status: string;
    driver_accepted: boolean;
    rider_accepted: boolean;
  };
  onCancel: (id: string) => void;
}

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getStatusDisplay = () => {
    if (booking.status === 'rejected') {
      return { text: 'Rejected', color: 'text-red-500' };
    }
    if (booking.driver_accepted && booking.rider_accepted) {
      return { text: 'Confirmed', color: 'text-green-500' };
    }
    if (booking.driver_accepted) {
      return { text: 'Awaiting your confirmation', color: 'text-yellow-500' };
    }
    if (booking.rider_accepted) {
      return { text: 'Awaiting driver confirmation', color: 'text-yellow-500' };
    }
    return { text: 'Pending', color: 'text-yellow-500' };
  };

  const handleAccept = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          rider_accepted: true,
          status: booking.driver_accepted ? 'confirmed' : 'pending'
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast({
        title: "Booking accepted",
        description: booking.driver_accepted 
          ? "The booking is now confirmed!" 
          : "Waiting for driver confirmation",
      });
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast({
        title: "Error accepting booking",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const status = getStatusDisplay();

  return (
    <Card className="bg-stripe-secondary border-stripe-muted">
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
              <div className={`text-sm ${status.color}`}>
                {status.text}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/chat/${booking.id}`)}
              className="text-stripe-text/60 hover:text-stripe-text"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            {booking.status === 'pending' && !booking.rider_accepted && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAccept}
                  className="text-green-500 hover:text-green-600"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCancel(booking.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
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
          <div className="mt-4 text-lg font-semibold text-stripe-accent">
            ${booking.ride.price}
          </div>
        </div>
      </div>
    </Card>
  );
};