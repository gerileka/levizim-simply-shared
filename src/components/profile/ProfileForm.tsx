import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ProfileAvatar } from "./ProfileAvatar";

interface ProfileFormProps {
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (surname: string) => void;
  email: string;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ProfileForm = ({
  name,
  setName,
  surname,
  setSurname,
  email,
  avatarUrl,
  setAvatarUrl,
  isUpdating,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <ProfileAvatar
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
        isUpdating={isUpdating}
      />
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="surname">Surname</Label>
        <Input
          id="surname"
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Enter your surname"
          disabled={isUpdating}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          disabled
          className="bg-gray-100"
        />
        <p className="text-sm text-gray-500">Email cannot be modified at this time</p>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isUpdating}
      >
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          'Update Profile'
        )}
      </Button>
    </form>
  );
};