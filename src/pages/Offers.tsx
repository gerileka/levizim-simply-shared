import { UserRides } from "@/components/UserRides";
import { SlidingMenu } from "@/components/SlidingMenu";

const OffersPage = () => {
  return (
    <div className="min-h-screen bg-stripe-bg text-stripe-text">
      <SlidingMenu />
      <div className="container px-4 py-16">
        <UserRides />
      </div>
    </div>
  );
};

export default OffersPage;