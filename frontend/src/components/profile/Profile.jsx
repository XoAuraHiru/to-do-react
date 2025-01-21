import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import useUser from '@/hooks/useUser';
import ProfileForm from './ProfileForm';
import ActivityList from './ActivityList';
import ChangePassword from './ChangePassword';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateProfile, getActivity, isLoading, error } = useUser();
  
  const [state, setState] = useState({
    successMessage: '',
    isSubmitting: false,
    activities: [],
    profileData: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  useEffect(() => {
    fetchUserActivity();
  }, []);

  const fetchUserActivity = async () => {
    const result = await getActivity();
    if (result.success) {
      setState(prev => ({
        ...prev,
        activities: result.data
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      successMessage: '' 
    }));

    const result = await updateProfile(state.profileData);
    
    setState(prev => ({
      ...prev,
      successMessage: result.success ? 'Profile updated successfully!' : '',
      isSubmitting: false
    }));

    if (result.success) {
      fetchUserActivity();
    }
  };

  const handleProfileChange = (field, value) => {
    setState(prev => ({
      ...prev,
      profileData: {
        ...prev.profileData,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-2">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <ProfileForm
                profileData={state.profileData}
                onSubmit={handleProfileUpdate}
                onChange={handleProfileChange}
                isSubmitting={state.isSubmitting}
                error={error}
                successMessage={state.successMessage}
              />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityList
                activities={state.activities}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="security">
              <ChangePassword />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;