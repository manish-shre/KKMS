import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';
import toast from 'react-hot-toast';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      const formattedEvents: Event[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        eventDate: event.event_date,
        location: event.location,
        imageUrl: event.image_url,
        isFeatured: event.is_featured,
        createdAt: event.created_at,
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (event: Omit<Event, 'id' | 'createdAt'>, file?: File) => {
    try {
      setLoading(true);
      
      let imageUrl = event.imageUrl;
      
      // Upload image if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `events/${fileName}`;
        
        console.log('Attempting to upload file:', {
          filePath,
          fileSize: file.size,
          fileType: file.type
        });
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Detailed upload error:', {
            error: uploadError,
            message: uploadError.message,
            name: uploadError.name
          });
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        console.log('Upload successful:', uploadData);
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }
      
      const { error: insertError, data } = await supabase
        .from('events')
        .insert([
          {
            title: event.title,
            description: event.description,
            event_date: event.eventDate,
            location: event.location,
            image_url: imageUrl,
            is_featured: event.isFeatured,
          },
        ])
        .select();
      
      if (insertError) {
        console.error('Error inserting event:', insertError);
        throw new Error('Failed to create event. Please try again.');
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned after creating event');
      }
      
      const newEvent: Event = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description,
        eventDate: data[0].event_date,
        location: data[0].location,
        imageUrl: data[0].image_url,
        isFeatured: data[0].is_featured,
        createdAt: data[0].created_at,
      };
      
      setEvents(prev => [newEvent, ...prev].sort((a, b) => 
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      ));
      
      toast.success('Event added successfully');
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (
    id: string,
    updates: Partial<Omit<Event, 'id' | 'createdAt'>>,
    file?: File
  ) => {
    try {
      setLoading(true);
      
      let imageUrl = updates.imageUrl;
      
      // Upload new image if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `events/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }
      
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.eventDate !== undefined) updateData.event_date = updates.eventDate;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (imageUrl !== undefined) updateData.image_url = imageUrl;
      if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;
      
      const { error, data } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      const updatedEvent: Event = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description,
        eventDate: data[0].event_date,
        location: data[0].location,
        imageUrl: data[0].image_url,
        isFeatured: data[0].is_featured,
        createdAt: data[0].created_at,
      };
      
      setEvents(prev => 
        prev.map(event => event.id === id ? updatedEvent : event)
          .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      );
      
      toast.success('Event updated successfully');
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setLoading(true);
      
      // Get event to get image URL
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('image_url')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Delete the event
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Try to delete the image from storage
      if (eventData?.image_url) {
        try {
          // Extract file path from URL
          const url = new URL(eventData.image_url);
          const pathParts = url.pathname.split('/');
          const filePath = pathParts.slice(pathParts.indexOf('images') + 1).join('/');
          
          if (filePath) {
            await supabase.storage.from('images').remove([filePath]);
          }
        } catch (storageError) {
          // Log but don't fail if image removal fails
          console.error('Error removing image:', storageError);
        }
      }
      
      setEvents(prev => prev.filter(event => event.id !== id));
      toast.success('Event deleted successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};