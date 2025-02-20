<<<<<<< HEAD
import supabase from './supabase.js';

async function fetchUsers() {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Users:', data);
    }
}

fetchUsers();
=======
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hggechldftdpgxaicyqu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ2VjaGxkZnRkcGd4YWljeXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTMxMDMsImV4cCI6MjA1NTYyOTEwM30.ofqTUnhfXuYxB_EDAd47Cp8Pk5OME5k3RZNTev9nP-o";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function insertData() {
  const { data, error } = await supabase
    .from("users") // Change "users" to your table name
    .insert([
      { name: "Aryaman", email: "aryaman@example.com" },
    ]);

  if (error) {
    console.error("❌ Error inserting data:", error);
  } else {
    console.log("✅ Data inserted successfully:", data);
  }
}

insertData();


>>>>>>> 1f6d08c (Added backend server with Supabase support)
