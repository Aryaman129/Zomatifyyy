iimport express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

// Check if environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.error("❌ Missing Supabase URL or API Key in .env");
  process.exit(1); // Stop the server if missing
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow all origins (adjust if needed)
app.use(express.json()); // Parse JSON requests

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
console.log("✅ Connected to Supabase");

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// Fetch Orders from Supabase
app.get("/api/orders", async (req, res) => {
  try {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add New Order
app.post("/api/orders", async (req, res) => {
  try {
    const { name, items, total, address, canteen } = req.body;
    if (!name || !items || !total || !address || !canteen) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("orders").insert([{ name, items, total, address, canteen }]);
    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Fix: Start the server only once
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
