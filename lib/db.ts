// Database connection utilities - integrate with Supabase, Neon, or your preferred database

import { createClient } from "@supabase/supabase-js"

// Server-side database client
export function createServerSupabaseClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.SUPABASE_SERVICE_ROLE_KEY || "")
}

// Browser-side database client
export function createBrowserSupabaseClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
}

// Type definitions for database tables
export type User = {
  id: string
  email: string
  name: string
  plan_id: string
  created_at: string
  updated_at: string
}

export type Cat = {
  id: string
  user_id: string
  name: string
  breed?: string
  date_of_birth?: string
  weight_kg?: number
  created_at: string
  updated_at: string
}

export type LitterVisit = {
  id: string
  cat_id: string
  visit_timestamp: string
  duration_seconds?: number
  weight_kg?: number
  anomaly_detected: boolean
  anomaly_type?: string
  created_at: string
}

export type HealthAlert = {
  id: string
  cat_id: string
  alert_type: string
  severity: string
  message: string
  is_read: boolean
  created_at: string
}
