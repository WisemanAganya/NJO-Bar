import { createClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          photo_url: string | null
          role: 'admin' | 'staff' | 'client'
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      bookings: {
        Row: {
          id: string
          client_id: string
          client_name: string
          event_date: string
          event_type: string
          guest_count: number
          status: 'pending' | 'confirmed' | 'cancelled'
          payment_status: 'unpaid' | 'partial' | 'paid'
          total_amount: number
          notes: string | null
          duration?: number
          location?: string
          is_recurring?: boolean
          recurring_pattern?: 'daily' | 'weekly' | 'monthly' | 'yearly'
          reminder_sent?: boolean
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      inventory: {
        Row: {
          id: string
          name: string
          category: 'Spirit' | 'Mixer' | 'Garnish' | 'Other'
          quantity: number
          unit: string
          price: number
          last_updated: string
        }
        Insert: any
        Update: any
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          category: string
          price: number
          stock: number
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      orders: {
        Row: {
          id: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          items: any
          total_amount: number
          status: string
          payment_status: string
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: any
        Update: any
      }
      package_requests: {
        Row: {
          id: string
          user_id: string
          package_id: string
          guest_count: number
          duration_hours: number
          bar_style: string
          staff_count: number
          estimated_price: number
          submitted_at: string
        }
        Insert: any
        Update: any
      }
      event_reminders: {
        Row: {
          id: string
          booking_id: string
          reminder_type: string
          scheduled_for: string
          message: string
          sent: boolean
          sent_at?: string | null
          created_at: string
        }
        Insert: any
        Update: any
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

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables. App features will not work correctly until they are added to Vercel.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) as any