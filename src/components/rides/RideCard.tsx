import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface RideCardProps {
  ride: {
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
      avatar_url: string;
    };
    bookings?: any[];
  };
  onClick?: () => void;
  selected?: boolean;
}

export const RideCard = ({ ride, onClick, selected }: RideCardProps) => {
  return (
    <Card 
      className={cn(
        "bg-stripe-secondary border-stripe-muted cursor-pointer transition-all",
        selected && "ring-2 ring-stripe-accent"
      )}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={ride.driver.avatar_url || '/placeholder.svg'}
              alt={ride.driver.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-stripe-text">
                {ride.driver.name}
              </h3>
              <div className="text-sm text-stripe-text/60">
                ★ {ride.driver.rating.toFixed(1)}
              </div>
            </div>
          </div>
          {ride.bookings && (
            <div className="text-sm text-stripe-text/60">
              {ride.bookings.length} booking{ride.bookings.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center text-stripe-text/80">
            <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
            {ride.from_location}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
            {ride.to_location}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <Calendar className="h-4 w-4 mr-2 text-stripe-accent" />
            {new Date(ride.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-stripe-text/80">
            <User className="h-4 w-4 mr-2 text-stripe-accent" />
            {ride.seats} {ride.seats === 1 ? "seat" : "seats"} available
          </div>
          <div className="mt-4 text-lg font-semibold text-stripe-accent">
            ${ride.price}
          </div>
        </div>
      </div>
    </Card>
  );
};