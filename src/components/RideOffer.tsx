import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { OfferForm } from "./offer/OfferForm";

export const RideOffer = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("name, surname")
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile?.name || !profile?.surname) {
        toast({
          title: "Profile incomplete",
          description: "Please complete your name and surname before offering a ride",
          variant: "destructive",
        });
        navigate("/profile");
        return;
      }

      const { error } = await supabase.from("rides").insert({
        driver_id: user.id,
        from_location: from,
        to_location: to,
        date,
        price: Number(price),
        seats: Number(seats),
      });

      if (error) throw error;

      toast({
        title: "Ride offered successfully",
        description: "Your ride has been posted",
      });

      navigate("/offers"); // Redirect to offers page after successful creation

      // Reset form
      setFrom("");
      setTo("");
      setDate("");
      setPrice("");
      setSeats("");
    } catch (error) {
      console.error("Error offering ride:", error);
      toast({
        title: "Error offering ride",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OfferForm
      from={from}
      setFrom={setFrom}
      to={to}
      setTo={setTo}
      date={date}
      setDate={setDate}
      price={price}
      setPrice={setPrice}
      seats={seats}
      setSeats={setSeats}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};