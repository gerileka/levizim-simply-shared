import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "../chat/ChatInterface";
import { Badge } from "@/components/ui/badge";

interface BookingRequestsProps {
  bookings?: {
    id: string;
    status: string;
    user: {
      id: string;
      name: string;
      avatar_url: string | null;
    };
    driver_accepted: boolean;
    rider_accepted: boolean;
  }[];
  onStatusChange: (bookingId: string, status: 'accepted' | 'rejected') => void;
  selectedBooking: string | null;
  setSelectedBooking: (id: string | null) => void;
}

const getStatusBadge = (status: string, driver_accepted: boolean, rider_accepted: boolean) => {
  if (status === 'rejected') {
    return <Badge variant="destructive">Rejected</Badge>;
  }
  
  if (status === 'confirmed') {
    return <Badge variant="default" className="bg-green-500">Confirmed</Badge>;
  }
  
  if (driver_accepted && !rider_accepted) {
    return <Badge variant="secondary" className="bg-yellow-500">Awaiting Rider</Badge>;
  }
  
  if (!driver_accepted && rider_accepted) {
    return <Badge variant="secondary" className="bg-yellow-500">Awaiting Driver</Badge>;
  }
  
  return <Badge variant="secondary">Pending</Badge>;
};

export const BookingRequests = ({ 
  bookings, 
  onStatusChange, 
  selectedBooking, 
  setSelectedBooking 
}: BookingRequestsProps) => {
  if (!bookings || bookings.length === 0) return null;

  return (
    <div className="mt-4 border-t border-stripe-muted pt-4">
      <h3 className="text-sm font-semibold text-stripe-text mb-2">Booking Requests</h3>
      <div className="space-y-3">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-stripe-bg p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={booking.user.avatar_url || '/placeholder.svg'}
                  alt={booking.user.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-stripe-text">{booking.user.name}</span>
                  {getStatusBadge(booking.status, booking.driver_accepted, booking.rider_accepted)}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                  className="text-stripe-text/60 hover:text-stripe-text"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
                {booking.status === 'pending' && !booking.driver_accepted && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onStatusChange(booking.id, 'accepted')}
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => onStatusChange(booking.id, 'rejected')}
                      variant="destructive"
                      size="sm"
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {selectedBooking === booking.id && (
              <div className="mt-4">
                <ChatInterface
                  bookingId={booking.id}
                  currentUserId={booking.user.id}
                  onStatusChange={(status) => onStatusChange(booking.id, status)}
                  isDriver={true}
                  status={booking.status}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};