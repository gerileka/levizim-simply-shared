import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSend: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatInput = ({ newMessage, setNewMessage, onSend, isLoading }: ChatInputProps) => {
  return (
    <form onSubmit={onSend} className="p-4 border-t border-stripe-muted">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};