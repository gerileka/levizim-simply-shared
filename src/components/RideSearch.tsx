import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RideSearchProps {
  onSearchResults: (rides: any[]) => void;
}

export const RideSearch = ({ onSearchResults }: RideSearchProps) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const query = supabase
        .from('rides')
        .select('*, profiles(id, name, surname, avatar_url, rating)')
        .gt('seats', 0);

      // Only add filters if values are provided
      if (fromLocation) query.eq('from_location', fromLocation);
      if (toLocation) query.eq('to_location', toLocation);
      if (date) query.eq('date', date);

      const { data, error } = await query;

      if (error) throw error;

      // Transform the data to include a full name
      const transformedData = data?.map(ride => ({
        ...ride,
        driver: {
          id: ride.profiles.id,
          name: `${ride.profiles.name || ''} ${ride.profiles.surname || ''}`.trim() || 'Anonymous',
          rating: ride.profiles.rating || 5.0,
          image: ride.profiles.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        }
      }));

      console.log('Found rides:', transformedData);
      onSearchResults(transformedData || []);
      
      toast({
        title: `Found ${transformedData?.length || 0} rides`,
        description: "Scroll down to see available rides",
      });
    } catch (error) {
      console.error('Error searching rides:', error);
      toast({
        title: "Error searching rides",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="from-search">From</Label>
          <Input
            id="from-search"
            placeholder="Enter departure city"
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to-search">To</Label>
          <Input
            id="to-search"
            placeholder="Enter destination city"
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date-search">Date</Label>
          <Input
            id="date-search"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <Button type="submit" className="w-full bg-sage-500 hover:bg-sage-600">
        Search Rides
        <Search className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
};