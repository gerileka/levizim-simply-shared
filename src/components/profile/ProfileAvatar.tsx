import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadAvatar } from "@/utils/uploadFile";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileAvatarProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  isUpdating: boolean;
}

export const ProfileAvatar = ({ avatarUrl, setAvatarUrl, isUpdating }: ProfileAvatarProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const publicUrl = await uploadAvatar(file);
      setAvatarUrl(publicUrl);
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading avatar",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Profile Picture</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} alt="Profile" />
          <AvatarFallback>
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "?"}
          </AvatarFallback>
        </Avatar>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="cursor-pointer"
          disabled={isUpdating}
        />
      </div>
    </div>
  );
};