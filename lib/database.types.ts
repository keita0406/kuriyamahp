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
      blogs: {
        Row: {
          id: string
          title: string
          slug: string
          content: string // TEXT型 - 50,000文字まで対応
          excerpt: string | null
          featured_image: string | null
          status: 'draft' | 'published' | 'archived'
          category: string | null
          tags: string[] | null
          meta_title: string | null
          meta_description: string | null
          author_id: string | null
          created_at: string
          updated_at: string
          published_at: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string // TEXT型 - 50,000文字まで対応
          excerpt?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published' | 'archived'
          category?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string // TEXT型 - 50,000文字まで対応
          excerpt?: string | null
          featured_image?: string | null
          status?: 'draft' | 'published' | 'archived'
          category?: string | null
          tags?: string[] | null
          meta_title?: string | null
          meta_description?: string | null
          author_id?: string | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
        }
      }
      blog_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
        }
      }
      admin_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'admin' | 'editor'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'admin' | 'editor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'admin' | 'editor'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 