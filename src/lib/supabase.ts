import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Store = {
  id: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  phone: string | null
  website: string | null
  specialty_tags: string[]
  rating: number | null
  review_count: number | null
  slug: string
  is_verified: boolean
  description: string | null
  address: string | null
  zip: string | null
}