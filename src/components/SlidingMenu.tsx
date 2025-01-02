import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const SlidingMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error checking session:', sessionError);
        // If there's an error checking session, just redirect to auth
        navigate("/auth");
        return;
      }

      if (!session) {
        // If no session exists, just redirect to auth page
        navigate("/auth");
        return;
      }

      // If we have a session, attempt to sign out
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error);
        toast({
          title: "Error signing out",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }

      // Successfully signed out
      navigate("/auth");
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const menuItems = [
    { label: "Profile", icon: User, onClick: () => navigate("/profile") },
    { label: "My Bookings", icon: List, onClick: () => navigate("/bookings") },
    { label: "My Offers", icon: List, onClick: () => navigate("/offers") },
    { label: "Logout", icon: LogOut, onClick: handleLogout },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50">
          <List className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 mt-4">
          {menuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};