import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
        .select("name")
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile?.name) {
        toast({
          title: "Profile incomplete",
          description: "Please complete your profile before offering a ride",
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="offer-from" className="text-stripe-text">From</Label>
          <Input
            id="offer-from"
            placeholder="Departure city"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="offer-to" className="text-stripe-text">To</Label>
          <Input
            id="offer-to"
            placeholder="Destination city"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="offer-date" className="text-stripe-text">Date</Label>
          <Input
            id="offer-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-stripe-text">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Price per seat"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seats" className="text-stripe-text">Available Seats</Label>
          <Input
            id="seats"
            type="number"
            placeholder="Number of seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
            min="1"
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-stripe-accent hover:bg-stripe-accent/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Offering Ride...
          </>
        ) : (
          'Offer Ride'
        )}
      </Button>
    </form>
  );
};