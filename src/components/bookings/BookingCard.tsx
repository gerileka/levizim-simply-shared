import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, X } from "lucide-react";
import { motion } from "framer-motion";

interface BookingCardProps {
  booking: {
    id: string;
    ride: {
      from_location: string;
      to_location: string;
      date: string;
      price: number;
      seats: number;
      driver: {
        name: string;
        rating: number;
        avatar_url: string;
      };
    };
    status: string;
  };
  onCancel: (id: string) => void;
}

export const BookingCard = ({ booking, onCancel }: BookingCardProps) => {
  return (
    <Card className="bg-stripe-secondary border-stripe-muted">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={booking.ride.driver.avatar_url || '/placeholder.svg'}
              alt={booking.ride.driver.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-stripe-text">
                {booking.ride.driver.name}
              </h3>
              <div className="text-sm text-stripe-text/60">
                ★ {booking.ride.driver.rating.toFixed(1)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCancel(booking.id)}
            className="text-stripe-text/60 hover:text-stripe-text"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-stripe-text/80">
            <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
            {booking.ride.from_location}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
            {booking.ride.to_location}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <Calendar className="h-4 w-4 mr-2 text-stripe-accent" />
            {new Date(booking.ride.date).toLocaleDateString()}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-stripe-text/60">Status: {booking.status}</span>
            <span className="text-lg font-semibold text-stripe-accent">
              ${booking.ride.price}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};