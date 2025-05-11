import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Member } from '../types';
import toast from 'react-hot-toast';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedMembers: Member[] = data.map(member => ({
        id: member.id,
        name: member.name,
        designation: member.designation,
        photoUrl: member.photo_url,
        bio: member.bio || undefined,
        contact: member.contact || undefined,
        createdAt: member.created_at,
      }));
      
      setMembers(formattedMembers);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching members:', err);
    } finally {
      setLoading(false);
    }
  };

  const createMember = async (member: Omit<Member, 'id' | 'createdAt'>, file?: File) => {
    try {
      setLoading(true);
      
      let photoUrl = member.photoUrl;
      
      // Upload photo if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `members/${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('members')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('members')
          .getPublicUrl(filePath);
        
        photoUrl = publicUrl;
      }
      
      const { error, data } = await supabase
        .from('members')
        .insert([
          {
            name: member.name,
            designation: member.designation,
            photo_url: photoUrl,
            bio: member.bio || null,
            contact: member.contact || null,
          },
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      const newMember: Member = {
        id: data[0].id,
        name: data[0].name,
        designation: data[0].designation,
        photoUrl: data[0].photo_url,
        bio: data[0].bio || undefined,
        contact: data[0].contact || undefined,
        createdAt: data[0].created_at,
      };
      
      setMembers(prev => [newMember, ...prev]);
      toast.success('Member added successfully');
      return newMember;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create member';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (
    id: string, 
    updates: Partial<Omit<Member, 'id' | 'createdAt'>>,
    file?: File
  ) => {
    try {
      setLoading(true);
      
      let photoUrl = updates.photoUrl;
      
      // Upload new photo if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `members/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('members')
          .upload(filePath, file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('members')
          .getPublicUrl(filePath);
        
        photoUrl = publicUrl;
      }
      
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.designation !== undefined) updateData.designation = updates.designation;
      if (photoUrl !== undefined) updateData.photo_url = photoUrl;
      if (updates.bio !== undefined) updateData.bio = updates.bio;
      if (updates.contact !== undefined) updateData.contact = updates.contact;
      
      const { error, data } = await supabase
        .from('members')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      const updatedMember: Member = {
        id: data[0].id,
        name: data[0].name,
        designation: data[0].designation,
        photoUrl: data[0].photo_url,
        bio: data[0].bio || undefined,
        contact: data[0].contact || undefined,
        createdAt: data[0].created_at,
      };
      
      setMembers(prev => 
        prev.map(member => member.id === id ? updatedMember : member)
      );
      
      toast.success('Member updated successfully');
      return updatedMember;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update member';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setLoading(true);
      
      // Get member to get photo URL
      const { data: memberData, error: fetchError } = await supabase
        .from('members')
        .select('photo_url')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete the member
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Try to delete the photo from storage
      if (memberData?.photo_url) {
        try {
          // Extract file path from URL
          const url = new URL(memberData.photo_url);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(pathParts.indexOf('members') + 1).join('/');
          
          if (filePath) {
            await supabase.storage.from('members').remove([filePath]);
          }
        } catch (storageError) {
          // Log but don't fail if image removal fails
          console.error('Error removing image:', storageError);
        }
      }
      
      setMembers(prev => prev.filter(member => member.id !== id));
      toast.success('Member deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete member';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    fetchMembers,
    createMember,
    updateMember,
    deleteMember,
  };
};