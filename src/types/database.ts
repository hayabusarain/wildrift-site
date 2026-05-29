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
      patches: {
        Row: {
          id: string
          version: string
          champion_name: string
          champion_name_en?: string | null
          change_type: "buff" | "nerf" | "adjust" | "new"
          description: string
          description_en?: string | null
          impact_json: Json | null
          created_at?: string
          is_champion?: boolean
        }
        Insert: {
          id?: string
          version: string
          champion_name: string
          champion_name_en?: string | null
          change_type: "buff" | "nerf" | "adjust" | "new"
          description: string
          description_en?: string | null
          impact_json?: Json | null
          created_at?: string
          is_champion?: boolean
        }
        Update: {
          id?: string
          version?: string
          champion_name?: string
          champion_name_en?: string | null
          change_type?: "buff" | "nerf" | "adjust" | "new"
          description?: string
          description_en?: string | null
          impact_json?: Json | null
          created_at?: string
          is_champion?: boolean
        }
      }
      tactical_boards: {
        Row: {
          id: string
          title: string
          board_state: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          board_state?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          board_state?: Json | null
          created_at?: string
        }
      }
    }
  }
}
