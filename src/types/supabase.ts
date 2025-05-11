export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          created_at: string
          name: string
          designation: string
          photo_url: string
          bio: string | null
          contact: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          designation: string
          photo_url: string
          bio?: string | null
          contact?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          designation?: string
          photo_url?: string
          bio?: string | null
          contact?: string | null
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          event_date: string
          location: string
          image_url: string
          is_featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          event_date: string
          location: string
          image_url: string
          is_featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          event_date?: string
          location?: string
          image_url?: string
          is_featured?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          message: string
          type: string
          is_read: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          message: string
          type: string
          is_read?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          message?: string
          type?: string
          is_read?: boolean
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          avatar_url: string | null
          role: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name: string
          avatar_url?: string | null
          role?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          avatar_url?: string | null
          role?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}