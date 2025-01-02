import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, X, MessageCircle } from "lucide-react";
import { ChatInterface } from "../chat/ChatInterface";
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
        name: string;
        rating: number;
        avatar_url: string;
      };
    };
    status: string;
  };
  onCancel: (id: string) => void;
}

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(booking.status);

  const handleStatusChange = async (newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', booking.id);

      if (error) throw error;

      setCurrentStatus(newStatus);
      toast({
        title: `Booking ${newStatus}`,
        description: `You have ${newStatus} this booking`,
      });
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error updating booking status",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

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
              <div className="text-sm text-stripe-text/60">
                ★ {booking.ride.driver.rating.toFixed(1)}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="text-stripe-text/60 hover:text-stripe-text"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCancel(booking.id)}
              className="text-stripe-text/60 hover:text-stripe-text"
            >
              <X className="h-4 w-4" />
            </Button>
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
          <div className="mt-4 flex items-center justify-between">
            <span className="text-stripe-text/60">Status: {currentStatus}</span>
            <span className="text-lg font-semibold text-stripe-accent">
              ${booking.ride.price}
            </span>
          </div>
        </div>
        
        {showChat && (
          <div className="mt-4">
            <ChatInterface
              bookingId={booking.id}
              currentUserId={booking.ride.driver.id}
              onStatusChange={handleStatusChange}
              isDriver={true}
              status={currentStatus}
            />
          </div>
        )}
      </div>
    </Card>
  );
};