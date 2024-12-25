import { motion } from "framer-motion";
import { Calendar, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RideCardProps {
  from: string;
  to: string;
  date: string;
  price: number;
  seats: number;
  driver: {
    name: string;
    rating: number;
    image: string;
  };
}

export const RideCard = ({ from, to, date, price, seats, driver }: RideCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <img
                src={driver.image}
                alt={driver.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">{driver.name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="flex items-center">
                    ★ {driver.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
            <span className="text-2xl font-bold text-sage-500">${price}</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5 text-sage-500" />
              <span>{from}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5 text-sage-500" />
              <span>{to}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-5 w-5 text-sage-500" />
              <span>{date}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <User className="h-5 w-5 text-sage-500" />
              <span>{seats} seats available</span>
            </div>
          </div>
          <Button className="w-full mt-4 bg-sage-500 hover:bg-sage-600">
            Book Now
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};