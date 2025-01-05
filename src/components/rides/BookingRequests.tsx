import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "../chat/ChatInterface";

interface BookingRequestsProps {
  bookings?: {
    id: string;
    status: string;
    user: {
      id: string;
      name: string;
      avatar_url: string | null;
    };
  }[];
  onStatusChange: (bookingId: string, status: 'accepted' | 'rejected') => void;
  selectedBooking: string | null;
  setSelectedBooking: (id: string | null) => void;
}

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
                <span className="text-sm text-stripe-text">{booking.user.name}</span>
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
                {booking.status === 'pending' && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onStatusChange(booking.id, 'accepted')}
                      className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => onStatusChange(booking.id, 'rejected')}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </Button>
                  </div>
                )}
                <span className={`text-xs px-2 py-1 rounded ${
                  booking.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
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