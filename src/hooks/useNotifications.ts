import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedNotifications: Notification[] = data.map(notification => ({
        id: notification.id,
        message: notification.message,
        type: notification.type as 'info' | 'success' | 'warning' | 'error',
        isRead: notification.is_read,
        createdAt: notification.created_at,
      }));
      
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.isRead).length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) {
        throw error;
      }
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up real-time subscription for new notifications
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newNotification: Notification = {
              id: payload.new.id,
              message: payload.new.message,
              type: payload.new.type,
              isRead: payload.new.is_read,
              createdAt: payload.new.created_at,
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            if (!newNotification.isRead) {
              setUnreadCount(prev => prev + 1);
            }
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [user]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};