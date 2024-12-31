import { motion } from "framer-motion";
import { Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
    image: string;
  };
}

export const RideCard = ({ id, from, to, date, price, seats, driver }: RideCardProps) => {
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to book a ride",
          variant: "destructive",
        });
        return;
      }

      // Check if user is trying to book their own ride
      if (user.id === driver.id) {
        toast({
          title: "Cannot book your own ride",
          description: "You cannot book a ride that you're offering",
          variant: "destructive",
        });
        return;
      }

      // Update the ride to decrease available seats
      const { error: updateError } = await supabase
        .from('rides')
        .update({ seats: seats - 1 })
        .eq('id', id)
        .gt('seats', 0);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Ride booked successfully",
        description: "Your booking has been confirmed",
      });

    } catch (error) {
      console.error('Error booking ride:', error);
      toast({
        title: "Error booking ride",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-stripe-secondary border-stripe-muted">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={driver.image}
                alt={driver.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-stripe-text">{driver.name}</h3>
                <div className="flex items-center text-sm text-stripe-text/60">
                  <span className="flex items-center">
                    ★ {driver.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-stripe-accent">${price}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-stripe-text/80">
              <MapPin className="h-5 w-5 text-stripe-accent" />
              <span>{from}</span>
            </div>
            <div className="flex items-center space-x-2 text-stripe-text/80">
              <MapPin className="h-5 w-5 text-stripe-accent" />
              <span>{to}</span>
            </div>
            <div className="flex items-center space-x-2 text-stripe-text/80">
              <Calendar className="h-5 w-5 text-stripe-accent" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-2 text-stripe-text/80">
              <User className="h-5 w-5 text-stripe-accent" />
              <span>{seats} seats available</span>
            </div>
          </div>
          <Button 
            className="w-full mt-4 bg-stripe-accent hover:bg-stripe-accent/90 text-white"
            onClick={handleBooking}
            disabled={isBooking || seats === 0}
          >
            {seats === 0 ? "Fully Booked" : isBooking ? "Booking..." : "Book Now"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};