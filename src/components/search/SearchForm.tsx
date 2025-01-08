import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Calendar as CalendarIcon } from "lucide-react";

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
    <form onSubmit={onSubmit} className="space-y-6 w-full max-w-4xl mx-auto px-4">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="from" className="text-stripe-text text-base">From</Label>
          <Input
            id="from"
            placeholder="Departure city"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
            className="h-12 text-base bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary focus:ring-stripe-accent focus:border-stripe-accent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="to" className="text-stripe-text text-base">To</Label>
          <Input
            id="to"
            placeholder="Destination city"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
            className="h-12 text-base bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary focus:ring-stripe-accent focus:border-stripe-accent"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date" className="text-stripe-text text-base">Date</Label>
          <div className="relative">
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 text-base bg-stripe-bg text-stripe-text placeholder:text-stripe-text/50 border-stripe-secondary focus:ring-stripe-accent focus:border-stripe-accent pl-12"
            />
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stripe-accent pointer-events-none" />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full md:w-auto min-w-[200px] h-12 text-base bg-stripe-accent hover:bg-stripe-accent/90 text-white font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Searching...
          </>
        ) : (
          'Search Rides'
        )}
      </Button>
    </form>
  );
};