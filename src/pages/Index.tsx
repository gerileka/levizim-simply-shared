import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { RideCard } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Ride {
  id: string;
  from_location: string;
  to_location: string;
  date: string;
  price: number;
  seats: number;
  profiles: {
    full_name: string | null;
    rating: number;
    avatar_url: string | null;
  };
}

const Index = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Ride[]>([]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSearchResults = (rides: Ride[]) => {
    setSearchResults(rides);
  };

  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
      <Hero onSearchResults={handleSearchResults} />
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold tracking-tighter mb-6">
                Search Results
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((ride) => (
                  <RideCard
                    key={ride.id}
                    from={ride.from_location}
                    to={ride.to_location}
                    date={ride.date}
                    price={ride.price}
                    seats={ride.seats}
                    driver={{
                      name: ride.profiles.full_name || "Anonymous",
                      rating: ride.profiles.rating,
                      image: ride.profiles.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;