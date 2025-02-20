import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = https://hggechldftdpgxaicyqu.supabase.co; // Replace with your Supabase URL
const SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ2VjaGxkZnRkcGd4YWljeXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTMxMDMsImV4cCI6MjA1NTYyOTEwM30.ofqTUnhfXuYxB_EDAd47Cp8Pk5OME5k3RZNTev9nP-o; // Replace with your Anon API Key

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
