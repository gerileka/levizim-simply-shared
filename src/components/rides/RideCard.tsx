import { Card } from "@/components/ui/card";
import { MapPin, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RideCardProps {
  ride: {
    id: string;
    from_location: string;
    to_location: string;
    date: string;
    price: number;
    seats: number;
  };
  onDelete: (id: string) => void;
}

export const RideCard = ({ ride, onDelete }: RideCardProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-stripe-text/80">
            <MapPin className="h-5 w-5 text-stripe-accent" />
            <span>{ride.from_location}</span>
          </div>
          <div className="flex items-center space-x-2 text-stripe-text/80">
            <MapPin className="h-5 w-5 text-stripe-accent" />
            <span>{ride.to_location}</span>
          </div>
          <div className="flex items-center space-x-2 text-stripe-text/80">
            <Calendar className="h-5 w-5 text-stripe-accent" />
            <span>{new Date(ride.date).toLocaleDateString()}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(ride.id)}
          className="text-red-500 hover:text-red-600 hover:bg-red-100"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span className="text-stripe-text/60">{ride.seats} seats available</span>
        <span className="text-lg font-semibold text-stripe-accent">${ride.price}</span>
      </div>
    </div>
  );
};