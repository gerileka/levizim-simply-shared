// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zhjvtesetmqhseghrssf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoanZ0ZXNldG1xaHNlZ2hyc3NmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzODU3NTQsImV4cCI6MjA1MDk2MTc1NH0.hdUmBSP5ZOw-MbZPYmCzJJf0gmb4M9zG6UV7kxLk5PM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);