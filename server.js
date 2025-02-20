import express from "express";
<<<<<<< HEAD
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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

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

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

=======
import { createClient } from "@supabase/supabase-js";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import 'dotenv/config';
dotenv.config(); // Load environment variables

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // Serve frontend files

// 🔗 Connect to Supabase
const SUPABASE_URL = "https://hggechldftdpgxaicyqu.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnZ2VjaGxkZnRkcGd4YWljeXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNTMxMDMsImV4cCI6MjA1NTYyOTEwM30.ofqTUnhfXuYxB_EDAd47Cp8Pk5OME5k3RZNTev9nP-o";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛒 Place Order (Max 50 Orders per Shop)
app.post("/place-order", async (req, res) => {
  const { customerName, items, amount, deliveryAddress, shopId } = req.body;

  // Get active order count
  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .eq("shop_id", shopId)
    .in("status", ["Pending", "Preparing"]);

  if (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }

  if (count >= 50) {
    return res.status(429).json({ message: "Queue full, please wait." });
  }

  // Insert order into Supabase
  const { data, error: insertError } = await supabase
    .from("orders")
    .insert([{ customer_name: customerName, items, amount, delivery_address: deliveryAddress, shop_id: shopId }]);

  if (insertError) {
    return res.status(500).json({ message: "Order placement failed", insertError });
  }

  io.emit("newOrder", data); // Notify shopkeepers

  res.json({ message: "Order placed successfully!", queuePosition: count + 1 });
});

// 📌 Fetch Orders for Shopkeepers
app.get("/orders", async (req, res) => {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    return res.status(500).json({ message: "Error fetching orders", error });
  }

  res.json(data);
});

// ✅ Add this test route
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend is working!" });
});

// ✅ Update Order Status
app.post("/update-status/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);

  if (error) {
    return res.status(500).json({ message: "Status update failed", error });
  }

  io.emit("orderUpdated", { orderId, status });

  res.json({ message: "Order status updated!" });
});

server.listen(3000, () => console.log("Server running on http://localhost:3000"));

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
>>>>>>> 1f6d08c (Added backend server with Supabase support)
