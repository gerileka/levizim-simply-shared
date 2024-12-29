import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const RideOffer = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [seats, setSeats] = useState("");
  const { toast } = useToast();

  const handleOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromLocation || !toLocation || !date || !price || !seats) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to offer a ride",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('rides')
        .insert([
          {
            driver_id: user.id,
            from_location: fromLocation,
            to_location: toLocation,
            date,
            price: parseFloat(price),
            seats: parseInt(seats),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Ride offered successfully",
        description: "Your ride has been posted",
      });

      // Clear form
      setFromLocation("");
      setToLocation("");
      setDate("");
      setPrice("");
      setSeats("");
    } catch (error) {
      console.error('Error offering ride:', error);
      toast({
        title: "Error offering ride",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleOffer} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="from-offer">From</Label>
          <Input
            id="from-offer"
            placeholder="Enter departure city"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to-offer">To</Label>
          <Input
            id="to-offer"
            placeholder="Enter destination city"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-offer">Date</Label>
          <Input
            id="date-offer"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seats">Available Seats</Label>
          <Input
            id="seats"
            type="number"
            placeholder="Enter number of seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
        Offer Ride
        <Car className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};