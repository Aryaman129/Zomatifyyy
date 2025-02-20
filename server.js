import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js"; // ✅ Import authentication routes

dotenv.config(); // Load environment variables

// 🔍 DEBUG: Check if environment variables are loaded
console.log("🔍 Checking Environment Variables...");
console.log("SUPABASE_URL:", process.env.SUPABASE_URL || "❌ MISSING");
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY ? "✅ FOUND" : "❌ MISSING");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ FOUND" : "❌ MISSING");

// ❌ STOP SERVER IF VARIABLES ARE MISSING
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: Missing required environment variables.");
  process.exit(1);
}

// ✅ Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
console.log("✅ Connected to Supabase");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

// ✅ Test Route to Ensure API Works
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ API is working!" });
});

// ✅ Authentication Routes
app.use("/api/auth", authRoutes);

// ✅ Fetch Orders from Supabase
app.get("/api/orders", async (req, res) => {
  try {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Add New Order
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

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


