import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface RideSearchProps {
  onSearchResults: (rides: any[]) => void;
}

export const RideSearch = ({ onSearchResults }: RideSearchProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let query = supabase
        .from("rides")
        .select(`
          *,
          driver:profiles!rides_driver_id_fkey (
            id,
            name,
            rating,
            avatar_url
          )
        `)
        .eq("from_location", from)
        .eq("to_location", to);

      // Only filter by date if a date is provided
      if (date) {
        query = query.gte("date", date);
      }

      const { data: rides, error } = await query;

      if (error) throw error;

      onSearchResults(rides || []);
      
      if (rides.length === 0) {
        toast({
          title: "No rides found",
          description: "Try different search criteria",
        });
      }
    } catch (error) {
      console.error("Error searching rides:", error);
      toast({
        title: "Error searching rides",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="from" className="text-stripe-text">From</Label>
          <Input
            id="from"
            placeholder="Departure city"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to" className="text-stripe-text">To</Label>
          <Input
            id="to"
            placeholder="Destination city"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-stripe-text">Date (Optional)</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            Searching...
          </>
        ) : (
          'Search Rides'
        )}
      </Button>
    </form>
  );
};