import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteProfileButtonProps {
  onDelete: () => void;
}

export const DeleteProfileButton = ({ onDelete }: DeleteProfileButtonProps) => {
  return (
    <Button
      variant="destructive"
      onClick={onDelete}
      className="flex items-center gap-2"
    >
      <Trash2 className="h-4 w-4" />
      Delete Profile
    </Button>
  );
};