import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RideDriverInfo } from "./RideDriverInfo";
import { RideDetails } from "./RideDetails";
import { useBookRide } from "@/hooks/useBookRide";

interface RideCardProps {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  seats: number;
  driver: {
    id: string;
    name: string;
    rating: number;
    avatar_url: string;
  };
  onBook?: () => void;
}

export const RideCard = ({
  id,
  from,
  to,
  date,
  price,
  seats,
  driver,
  onBook,
}: RideCardProps) => {
  const { bookRide, isLoading } = useBookRide(onBook);

  return (
    <Card className="bg-stripe-secondary border-stripe-muted">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <RideDriverInfo
            name={driver.name}
            rating={driver.rating}
            avatarUrl={driver.avatar_url}
          />
          <Button
            onClick={() => bookRide(id, seats)}
            disabled={isLoading || seats === 0}
            className="bg-stripe-accent hover:bg-stripe-accent/90"
          >
            {isLoading ? "Booking..." : `Book - $${price}`}
          </Button>
        </div>
        <RideDetails
          from={from}
          to={to}
          date={date}
          seats={seats}
        />
      </div>
    </Card>
  );
};