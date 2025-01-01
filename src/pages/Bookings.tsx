import { MyBookings } from "@/components/MyBookings";
import { SlidingMenu } from "@/components/SlidingMenu";

const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-stripe-bg text-stripe-text">
      <SlidingMenu />
      <div className="container px-4 py-16">
        <MyBookings />
      </div>
    </div>
  );
};

export default BookingsPage;