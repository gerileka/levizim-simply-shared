import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface OfferFormProps {
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  price: string;
  setPrice: (value: string) => void;
  seats: string;
  setSeats: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const OfferForm = ({
  from,
  setFrom,
  to,
  setTo,
  date,
  setDate,
  price,
  setPrice,
  seats,
  setSeats,
  onSubmit,
  isLoading,
}: OfferFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="offer-from" className="text-stripe-text">From</Label>
          <Input
            id="offer-from"
            placeholder="Departure city"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="offer-to" className="text-stripe-text">To</Label>
          <Input
            id="offer-to"
            placeholder="Destination city"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="offer-date" className="text-stripe-text">Date</Label>
          <Input
            id="offer-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-stripe-text">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Price per seat"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seats" className="text-stripe-text">Available Seats</Label>
          <Input
            id="seats"
            type="number"
            placeholder="Number of seats"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
            min="1"
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-stripe-accent hover:bg-stripe-accent/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Offering Ride...
          </>
        ) : (
          'Offer Ride'
        )}
      </Button>
    </form>
  );
};