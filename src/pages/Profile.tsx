import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadAvatar } from "@/utils/uploadFile";
import { Loader2, Trash2 } from "lucide-react";

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

      const { data, error } = await supabase
        .from('profiles')
        .select('name, surname, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setName(data.name || '');
        setSurname(data.surname || '');
        setEmail(data.email || '');
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const publicUrl = await uploadAvatar(file);
      setAvatarUrl(publicUrl);
      toast({
        title: "Avatar uploaded",
        description: "Your avatar has been updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error uploading avatar",
        description: "Please try again later",
        variant: "destructive",
      });
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <Button
            variant="destructive"
            onClick={deleteProfile}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Profile
          </Button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="avatar">Profile Picture</Label>
              {avatarUrl && (
                <div className="mb-4">
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </div>
              )}
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname">Surname</Label>
              <Input
                id="surname"
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Enter your surname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100"
              />
              <p className="text-sm text-gray-500">Email cannot be modified at this time</p>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;