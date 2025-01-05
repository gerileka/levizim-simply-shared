import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

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
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  };

  useEffect(() => {
    fetchMessages();
    
    const channel = supabase
      .channel(`booking_${bookingId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `booking_id=eq.${bookingId}`
        },
        async (payload) => {
          const { data: senderData, error: senderError } = await supabase
            .from('profiles')
            .select('name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          if (senderError) {
            console.error('Error fetching sender data:', senderError);
            return;
          }

          const newMessage = {
            ...payload.new,
            sender: senderData
          };

          setMessages(prevMessages => [...prevMessages, newMessage]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          sender:profiles!messages_sender_id_fkey (
            name,
            avatar_url
          )
        `)
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      setTimeout(scrollToBottom, 100);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            booking_id: bookingId,
            sender_id: user.id,
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
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === currentUserId}
            />
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

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSend={sendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};