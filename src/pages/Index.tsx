import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { RideCard } from "@/components/RideCard";
import { useState } from "react";
import { SlidingMenu } from "@/components/SlidingMenu";

interface Ride {
  id: string;
  from_location: string;
  to_location: string;
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

const Index = () => {
  const [searchResults, setSearchResults] = useState<Ride[]>([]);

  const handleSearchResults = (rides: Ride[]) => {
    setSearchResults(rides);
  };

  return (
    <div className="min-h-screen bg-stripe-bg text-stripe-text">
      <SlidingMenu />
      <Hero onSearchResults={handleSearchResults} />
      <section className="py-16 bg-stripe-bg">
        <div className="container px-4 md:px-6">
          {searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-2xl font-bold tracking-tighter mb-6 text-stripe-text">
                Search Results
              </h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((ride) => (
                  <RideCard
                    key={ride.id}
                    id={ride.id}
                    from={ride.from_location}
                    to={ride.to_location}
                    date={ride.date}
                    price={ride.price}
                    seats={ride.seats}
                    driver={ride.driver}
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