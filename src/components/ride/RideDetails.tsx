import { Calendar, MapPin, User } from "lucide-react";

interface RideDetailsProps {
  from: string;
  to: string;
  date: string;
  seats: number;
}

export const RideDetails = ({ from, to, date, seats }: RideDetailsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center text-stripe-text/80">
        <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
        {from}
      </div>
      <div className="flex items-center text-stripe-text/80">
        <MapPin className="h-4 w-4 mr-2 text-stripe-accent" />
        {to}
      </div>
      <div className="flex items-center text-stripe-text/80">
        <Calendar className="h-4 w-4 mr-2 text-stripe-accent" />
        {new Date(date).toLocaleDateString()}
      </div>
      <div className="flex items-center text-stripe-text/80">
        <User className="h-4 w-4 mr-2 text-stripe-accent" />
        {seats} {seats === 1 ? "seat" : "seats"} available
      </div>
    </div>
  );
};