import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface RideCardProps {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  seats: number;
  driver: {
    id: string;
    name: string;
    rating: number;
    avatar_url: string;
  };
  onBook?: () => void;
}

export const RideCard = ({
  id,
  from,
  to,
  date,
  price,
  seats,
  driver,
  onBook,
}: RideCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBook = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, surname")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile?.name || !profile?.surname) {
        toast({
          title: "Profile incomplete",
          description: "Please complete your profile before booking a ride",
          variant: "destructive",
        });
        navigate("/profile");
        return;
      }

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            ride_id: id,
            user_id: user.id,
            status: 'pending',
            driver_accepted: false,
            rider_accepted: true
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      toast({
        title: "Booking request sent",
        description: "The driver will review your request",
      });

      navigate(`/chat/${booking.id}`);

      if (onBook) onBook();
    } catch (error) {
      console.error("Error booking ride:", error);
      toast({
        title: "Error booking ride",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-stripe-secondary border-stripe-muted">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={driver.avatar_url || '/placeholder.svg'}
              alt={driver.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-stripe-text">
                {driver.name}
              </h3>
              <div className="text-sm text-stripe-text/60">
                ★ {driver.rating.toFixed(1)}
              </div>
            </div>
          </div>
          <Button
            onClick={handleBook}
            disabled={isLoading || seats === 0}
            className="bg-stripe-accent hover:bg-stripe-accent/90"
          >
            {isLoading ? "Booking..." : `Book - $${price}`}
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-stripe-text/80">
            <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
            {from}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
            {to}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <Calendar className="h-4 w-4 mr-2 text-stripe-accent" />
            {new Date(date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <User className="h-4 w-4 mr-2 text-stripe-accent" />
            {seats} {seats === 1 ? "seat" : "seats"} available
          </div>
        </div>
      </div>
    </Card>
  );
};