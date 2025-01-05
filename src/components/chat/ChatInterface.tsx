import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender: {
    name: string;
    avatar_url: string;
  };
}

interface ChatInterfaceProps {
  bookingId: string;
  currentUserId: string;
  onStatusChange?: (status: 'accepted' | 'rejected') => void;
  isDriver: boolean;
  status: string;
}

export const ChatInterface = ({ 
  bookingId, 
  currentUserId,
  onStatusChange,
  isDriver,
  status 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const channel = supabase
      .channel(`messages_${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender:profiles!messages_sender_id_fkey (
            name,
            avatar_url
          )
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error loading messages",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            booking_id: bookingId,
            sender_id: currentUserId,
            content: newMessage.trim()
          }
        ]);

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-stripe-secondary rounded-lg border border-stripe-muted">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender.name === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                <img
                  src={message.sender.avatar_url || "/placeholder.svg"}
                  alt={message.sender.name}
                  className="w-8 h-8 rounded-full"
                />
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
          ))}
        </div>
      </ScrollArea>
      
      {status === 'pending' && isDriver && (
        <div className="p-4 border-t border-stripe-muted">
          <div className="flex gap-2">
            <Button
              onClick={() => onStatusChange?.('accepted')}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              Accept Booking
            </Button>
            <Button
              onClick={() => onStatusChange?.('rejected')}
              variant="destructive"
              className="flex-1"
            >
              Reject Booking
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={sendMessage} className="p-4 border-t border-stripe-muted">
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
    </div>
  );
};