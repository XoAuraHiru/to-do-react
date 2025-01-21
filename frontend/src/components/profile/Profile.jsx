import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileForm from './ProfileForm';
import ActivityList from './ActivityList';

const Profile = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    isLoading: false,
    error: '',
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
    setState(prev => ({ ...prev, isLoading: true, error: '' }));
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/users/activity',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setState(prev => ({ 
        ...prev, 
        activities: response.data,
        isLoading: false 
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Failed to fetch user activity',
        isLoading: false
      }));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: '', 
      successMessage: '' 
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        state.profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setState(prev => ({ 
        ...prev,
        successMessage: 'Profile updated successfully!',
        isSubmitting: false
      }));
      fetchUserActivity(); // Refresh activity after update
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err.response?.data?.message || 'Failed to update profile',
        isSubmitting: false
      }));
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
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <ProfileForm
                profileData={state.profileData}
                onSubmit={handleProfileUpdate}
                onChange={handleProfileChange}
                isSubmitting={state.isSubmitting}
                error={state.error}
                successMessage={state.successMessage}
              />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityList
                activities={state.activities}
                isLoading={state.isLoading}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;