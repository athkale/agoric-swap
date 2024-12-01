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
      time_capsules: {
        Row: {
          id: string
          profile_id: string
          title: string
          content: string
          type: 'message' | 'memory' | 'prediction' | 'nft' | 'legacy'
          unlock_date: string
          auto_delete_date: string | null
          created_at: string
          is_locked: boolean
          is_viewed: boolean
          visibility: 'public' | 'private'
          attachments: {
            type: 'image' | 'video'
            url: string
          }[]
          reactions: {
            type: string
            count: number
          }[]
          comments: {
            id: string
            content: string
            created_at: string
            created_by: string
          }[]
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          content: string
          type: 'message' | 'memory' | 'prediction' | 'nft' | 'legacy'
          unlock_date: string
          auto_delete_date?: string | null
          created_at?: string
          is_locked?: boolean
          is_viewed?: boolean
          visibility?: 'public' | 'private'
          attachments?: {
            type: 'image' | 'video'
            url: string
          }[]
          reactions?: {
            type: string
            count: number
          }[]
          comments?: {
            id: string
            content: string
            created_at: string
            created_by: string
          }[]
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          content?: string
          type?: 'message' | 'memory' | 'prediction' | 'nft' | 'legacy'
          unlock_date?: string
          auto_delete_date?: string | null
          created_at?: string
          is_locked?: boolean
          is_viewed?: boolean
          visibility?: 'public' | 'private'
          attachments?: {
            type: 'image' | 'video'
            url: string
          }[]
          reactions?: {
            type: string
            count: number
          }[]
          comments?: {
            id: string
            content: string
            created_at: string
            created_by: string
          }[]
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
