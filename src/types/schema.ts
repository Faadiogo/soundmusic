
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SongStatus = 
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'in_production'
  | 'mastering'
  | 'distribution_pending'
  | 'published'
  | 'rejected';

export interface Database {
  public: {
    Tables: {
      artists: {
        Row: {
          id: string
          created_at: string
          userId: string
          name: string
          artisticName: string
          birthDate: string
          cpf: string
          soundOnEmail: string | null
          onerpmEmail: string | null
          spotifyLink: string | null
          youtubeLink: string | null
          tiktokLink: string | null
          instagramLink: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          userId: string
          name: string
          artisticName: string
          birthDate: string
          cpf: string
          soundOnEmail?: string | null
          onerpmEmail?: string | null
          spotifyLink?: string | null
          youtubeLink?: string | null
          tiktokLink?: string | null
          instagramLink?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          userId?: string
          name?: string
          artisticName?: string
          birthDate?: string
          cpf?: string
          soundOnEmail?: string | null
          onerpmEmail?: string | null
          spotifyLink?: string | null
          youtubeLink?: string | null
          tiktokLink?: string | null
          instagramLink?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          role: string
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: string
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      song_collaborators: {
        Row: {
          id: string
          songId: string
          artistId: string
          role: string
          royaltyPercentage: number
        }
        Insert: {
          id?: string
          songId: string
          artistId: string
          role: string
          royaltyPercentage: number
        }
        Update: {
          id?: string
          songId?: string
          artistId?: string
          role?: string
          royaltyPercentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "song_collaborators_artistId_fkey"
            columns: ["artistId"]
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "song_collaborators_songId_fkey"
            columns: ["songId"]
            referencedRelation: "songs"
            referencedColumns: ["id"]
          }
        ]
      }
      songs: {
        Row: {
          id: string
          created_at: string
          userId: string
          title: string
          genre: string
          lyrics: string | null
          duration: number
          audioUrl: string | null
          releaseDate: string
          distributorRoyalty: number
          streams: number
          revenue: number
          status: SongStatus
          status_notes: string | null
          status_updated_at: string
          status_updated_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          userId: string
          title: string
          genre: string
          lyrics?: string | null
          duration: number
          audioUrl?: string | null
          releaseDate: string
          distributorRoyalty: number
          streams?: number
          revenue?: number
          status?: SongStatus
          status_notes?: string | null
          status_updated_at?: string
          status_updated_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          userId?: string
          title?: string
          genre?: string
          lyrics?: string | null
          duration?: number
          audioUrl?: string | null
          releaseDate?: string
          distributorRoyalty?: number
          streams?: number
          revenue?: number
          status?: SongStatus
          status_notes?: string | null
          status_updated_at?: string
          status_updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "songs_userId_fkey"
            columns: ["userId"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
