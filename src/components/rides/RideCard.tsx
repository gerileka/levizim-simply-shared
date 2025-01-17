import { Card } from "@/components/ui/card";
import { Calendar, MapPin, User, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RideCardProps {
  ride: {
    id: string;
    from_location: string;
    to_location: string;
    date: string;
    price: number;
    seats: number;
    driver?: {
      id: string;
      name: string;
      rating: number;
      avatar_url: string | null;
    };
    bookings?: any[];
  };
  onClick?: () => void;
  selected?: boolean;
}

export const RideCard = ({ ride, onClick, selected }: RideCardProps) => {
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick of the card
    try {
      const { error } = await supabase
        .from('rides')
        .delete()
        .eq('id', ride.id);

      if (error) throw error;

      toast({
        title: "Ride deleted",
        description: "Your ride has been deleted successfully",
      });

      // Refresh the page to show updated list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting ride:', error);
      toast({
        title: "Error deleting ride",
        description: "There was an error deleting your ride",
        variant: "destructive",
      });
    }
  };

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
              src={ride.driver?.avatar_url || '/placeholder.svg'}
              alt={ride.driver?.name || 'Driver'}
              className="w-10 h-10 rounded-full object-cover bg-gray-100"
            />
            <div>
              <h3 className="font-medium text-stripe-text">
                {ride.driver?.name || 'Loading...'}
              </h3>
              {ride.driver?.rating && (
                <div className="text-sm text-stripe-text/60">
                  ★ {ride.driver.rating.toFixed(1)}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(!ride.bookings || ride.bookings.length === 0) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-red-500 hover:text-red-600 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            {ride.bookings && (
              <div className="text-sm text-stripe-text/60">
                {ride.bookings.length} booking{ride.bookings.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
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