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
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-2 max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar_url || "/placeholder.svg"} alt={message.sender.name} />
          <AvatarFallback>{message.sender.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
        </Avatar>
        <div className={`rounded-lg p-3 ${
          isCurrentUser 
            ? "bg-stripe-accent text-white" 
            : "bg-stripe-accent/10"
        }`}>
          <p className="text-sm font-medium text-stripe-text">
            {message.sender.name}
          </p>
          <p className={`${isCurrentUser ? "text-white" : "text-stripe-text/80"}`}>
            {message.content}
          </p>
          <p className={`text-xs mt-1 ${
            isCurrentUser ? "text-white/60" : "text-stripe-text/60"
          }`}>
            {new Date(message.created_at).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};