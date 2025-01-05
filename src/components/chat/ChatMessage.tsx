import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    created_at: string;
    sender: {
      name: string;
      avatar_url: string;
    };
  };
  isCurrentUser: boolean;
}

export const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className="flex items-start gap-2 max-w-[80%]">
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar_url || "/placeholder.svg"} alt={message.sender.name} />
          <AvatarFallback>{message.sender.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div className="bg-stripe-accent/10 rounded-lg p-3">
          <p className="text-sm font-medium text-stripe-text">
            {message.sender.name}
          </p>
          <p className="text-stripe-text/80">{message.content}</p>
          <p className="text-xs text-stripe-text/60 mt-1">
            {new Date(message.created_at).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};