import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, List, Calendar, X, Home } from "lucide-react";
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
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sb-') || key.startsWith('supabase.')) {
      localStorage.removeItem(key);
    }
  });
  
  supabase.auth.signOut();
};

export const SlidingMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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
    { label: "Home", icon: Home, path: "/", onClick: () => navigate("/") },
    { label: "Profile", icon: User, path: "/profile", onClick: () => navigate("/profile") },
    { label: "My Bookings", icon: Calendar, path: "/bookings", onClick: () => navigate("/bookings") },
    { label: "My Offers", icon: List, path: "/offers", onClick: () => navigate("/offers") },
    { label: "Logout", icon: LogOut, path: null, onClick: handleLogout },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-6 right-4 md:top-4 z-50 h-12 w-12 rounded-full shadow-lg hover:shadow-xl transition-all bg-stripe-bg border-stripe-accent hover:bg-stripe-secondary"
        >
          <List className="h-6 w-6 text-stripe-accent" />
        </Button>
      </SheetTrigger>
      <div className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      <SheetContent className="w-[280px] sm:w-[350px] bg-stripe-bg border-stripe-secondary">
        <SheetHeader className="relative border-b border-stripe-secondary pb-4 mb-4">
          <SheetTitle className="text-stripe-text text-xl">Menu</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 rounded-full h-10 w-10"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </SheetHeader>
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const isActive = item.path && location.pathname === item.path;
            return (
              <Button
                key={item.label}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 h-12 text-base ${
                  isActive 
                    ? 'bg-stripe-accent text-white hover:bg-stripe-accent/90' 
                    : 'text-stripe-text hover:bg-stripe-secondary'
                }`}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-stripe-accent'}`} />
                <span className={`${isActive ? 'font-medium' : ''}`}>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};