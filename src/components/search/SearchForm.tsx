import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface SearchFormProps {
  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SearchForm = ({
  from,
  setFrom,
  to,
  setTo,
  date,
  setDate,
  onSubmit,
  isLoading,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="from" className="text-stripe-text">From</Label>
          <Input
            id="from"
            placeholder="Departure city"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to" className="text-stripe-text">To</Label>
          <Input
            id="to"
            placeholder="Destination city"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-stripe-text">Date (Optional)</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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
            Searching...
          </>
        ) : (
          'Search Rides'
        )}
      </Button>
    </form>
  );
};