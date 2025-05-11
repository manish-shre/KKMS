import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import FormField from '../../components/ui/FormField';
import ImageUpload from '../../components/ui/ImageUpload';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { profile, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: profile?.fullName || '',
      avatarUrl: profile?.avatarUrl || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };

  const handleProfileUpdate = async (data) => {
    setIsLoading(true);
    try {
      let avatarUrl = profile?.avatarUrl;
      
      // Handle avatar upload if file selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, selectedFile);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL for avatar
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        avatarUrl = publicUrl;
      }
      
      // Update profile
      await updateProfile({
        fullName: data.fullName,
        avatarUrl,
      });
      
      // Handle password change if requested
      if (changePassword && data.currentPassword && data.newPassword) {
        const { error } = await supabase.auth.updateUser({
          password: data.newPassword,
        });
        
        if (error) {
          throw error;
        }
        
        // Reset password fields
        reset({
          fullName: data.fullName,
          avatarUrl: avatarUrl || data.avatarUrl,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        
        setChangePassword(false);
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <FormField
                    label="Full Name"
                    htmlFor="fullName"
                    required
                    error={errors.fullName?.message}
                  >
                    <Input
                      id="fullName"
                      {...register('fullName', { required: 'Full name is required' })}
                      error={errors.fullName?.message}
                    />
                  </FormField>

                  <FormField
                    label="Email"
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      value={profile?.id}
                      disabled
                      className="bg-gray-50"
                    />
                  </FormField>

                  <FormField
                    label="Role"
                    htmlFor="role"
                  >
                    <Input
                      id="role"
                      value={profile?.role || 'Administrator'}
                      disabled
                      className="bg-gray-50"
                    />
                  </FormField>
                </div>

                <div className="flex flex-col items-center">
                  <FormField
                    label="Profile Photo"
                    htmlFor="avatarUrl"
                    error={errors.avatarUrl?.message}
                  >
                    <ImageUpload
                      onFileChange={handleFileChange}
                      initialImage={watch('avatarUrl')}
                      error={errors.avatarUrl?.message}
                    />
                    <Input
                      id="avatarUrl"
                      type="hidden"
                      {...register('avatarUrl')}
                    />
                  </FormField>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Password</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setChangePassword(!changePassword)}
                  >
                    {changePassword ? 'Cancel' : 'Change Password'}
                  </Button>
                </div>

                {changePassword && (
                  <div className="mt-4 space-y-4">
                    <FormField
                      label="Current Password"
                      htmlFor="currentPassword"
                      required
                      error={errors.currentPassword?.message}
                    >
                      <Input
                        id="currentPassword"
                        type="password"
                        {...register('currentPassword', { 
                          required: 'Current password is required' 
                        })}
                        error={errors.currentPassword?.message}
                      />
                    </FormField>

                    <FormField
                      label="New Password"
                      htmlFor="newPassword"
                      required
                      error={errors.newPassword?.message}
                    >
                      <Input
                        id="newPassword"
                        type="password"
                        {...register('newPassword', { 
                          required: 'New password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        error={errors.newPassword?.message}
                      />
                    </FormField>

                    <FormField
                      label="Confirm New Password"
                      htmlFor="confirmPassword"
                      required
                      error={errors.confirmPassword?.message}
                    >
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword', { 
                          required: 'Please confirm your password',
                          validate: (val) => {
                            if (watch('newPassword') !== val) {
                              return "Passwords do not match";
                            }
                          }
                        })}
                        error={errors.confirmPassword?.message}
                      />
                    </FormField>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Account Created</h3>
                <p>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Last Updated</h3>
                <p>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="pt-4">
                <h3 className="mb-2 text-sm font-semibold text-gray-500">Account Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full text-left"
                    size="sm"
                  >
                    View Login History
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-left"
                    size="sm"
                  >
                    Export My Data
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;