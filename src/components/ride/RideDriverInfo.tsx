import { Avatar } from "@/components/ui/avatar";

interface RideDriverInfoProps {
  name: string;
  rating: number;
  avatarUrl: string;
}

export const RideDriverInfo = ({ name, rating, avatarUrl }: RideDriverInfoProps) => {
  return (
    <div className="flex items-center space-x-3">
      <Avatar>
        <img
          src={avatarUrl || '/placeholder.svg'}
          alt={name}
          className="w-10 h-10 rounded-full"
        />
      </Avatar>
      <div>
        <h3 className="font-medium text-stripe-text">
          {name}
        </h3>
        <div className="text-sm text-stripe-text/60">
          ★ {rating.toFixed(1)}
        </div>
      </div>
    </div>
  );
};