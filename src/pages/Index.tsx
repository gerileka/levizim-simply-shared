import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import { RideCard } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const featuredRides = [
  {
    from: "New York",
    to: "Boston",
    date: "Tomorrow, 9:00 AM",
    price: 45,
    seats: 3,
    driver: {
      name: "John Doe",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    from: "San Francisco",
    to: "Los Angeles",
    date: "Friday, 10:30 AM",
    price: 65,
    seats: 2,
    driver: {
      name: "Jane Smith",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    from: "Chicago",
    to: "Detroit",
    date: "Saturday, 8:00 AM",
    price: 35,
    seats: 4,
    driver: {
      name: "Mike Johnson",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
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
      <Hero />
      <section className="py-16 bg-gray-50">
        <div className="container px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tighter mb-4">
              Featured Rides
            </h2>
            <p className="text-gray-500 max-w-[600px] mx-auto">
              Discover popular routes and trusted drivers in your area
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredRides.map((ride, index) => (
              <RideCard key={index} {...ride} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;