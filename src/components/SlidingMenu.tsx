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

const clearAuthState = () => {
  // Clear all Supabase-related items from localStorage
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.startsWith('supabase.')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear any existing sessions
  supabase.auth.signOut();
};

export const SlidingMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      clearAuthState();
      navigate("/auth");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      clearAuthState();
      navigate("/auth");
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