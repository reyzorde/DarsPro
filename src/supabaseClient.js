import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ovhvramqwdnuhlyzyayz.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92aHZyYW1xd2RudWhseXp5YXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MDAyMDMsImV4cCI6MjEwMzQ3NjIwM30.C0YC7L7Agysc0HDjFGn7RuLM_1I5MHRxM_fGUEmgSgY"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)