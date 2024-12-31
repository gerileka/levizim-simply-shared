import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchForm } from "./search/SearchForm";

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
    <SearchForm
      from={from}
      setFrom={setFrom}
      to={to}
      setTo={setTo}
      date={date}
      setDate={setDate}
      onSubmit={handleSearch}
      isLoading={isLoading}
    />
  );
};