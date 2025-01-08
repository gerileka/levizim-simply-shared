import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { uploadAvatar } from "@/utils/uploadFile";
import { Loader2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef } from "react";

interface ProfileAvatarProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  isUpdating: boolean;
}

export const ProfileAvatar = ({ avatarUrl, setAvatarUrl, isUpdating }: ProfileAvatarProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="avatar">Profile Picture</Label>
      <div className="flex items-center justify-center">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          <Avatar className="h-24 w-24 md:h-28 md:w-28">
            <AvatarImage src={avatarUrl} alt="Profile" />
            <AvatarFallback>
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>
        <input
          ref={fileInputRef}
          id="avatar"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUpdating}
        />
      </div>
    </div>
  );
};