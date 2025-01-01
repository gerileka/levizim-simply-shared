import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useBookRide = (onBook?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const bookRide = async (rideId: string, seats: number) => {
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

      const { data: ride, error: rideError } = await supabase
        .from('rides')
        .select('seats')
        .eq('id', rideId)
        .single();

      if (rideError) throw rideError;

      if (!ride || ride.seats <= 0) {
        toast({
          title: "Ride unavailable",
          description: "This ride is fully booked",
          variant: "destructive",
        });
        return;
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            ride_id: rideId,
            user_id: user.id,
            status: 'confirmed'
          }
        ]);

      if (bookingError) throw bookingError;

      const { error: updateError } = await supabase
        .from('rides')
        .update({ seats: seats - 1 })
        .eq('id', rideId);

      if (updateError) throw updateError;

      toast({
        title: "Ride booked successfully",
        description: "Your ride has been booked",
      });

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

  return { bookRide, isLoading };
};