import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft } from "lucide-react";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { DeleteProfileButton } from "@/components/profile/DeleteProfileButton";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Set email from auth user data
      setEmail(user.email || '');

      const { data, error } = await supabase
        .from('profiles')
        .select('name, surname, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name || '');
        setSurname(data.surname || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error loading profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name,
          surname,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const deleteProfile = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );
      
      if (deleteError) throw deleteError;

      navigate('/auth');
      toast({
        title: "Profile deleted",
        description: "Your profile has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error deleting profile",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex items-center mb-8 gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <div className="flex-1 flex justify-end">
            <DeleteProfileButton onDelete={deleteProfile} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <ProfileForm
            name={name}
            setName={setName}
            surname={surname}
            setSurname={setSurname}
            email={email}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            isUpdating={updating}
            onSubmit={updateProfile}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;