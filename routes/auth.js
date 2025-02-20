import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Route: User Signup
router.post("/signup", async (req, res) => {
    const { email, password, role } = req.body; // Role can be 'customer' or 'shopkeeper'

    if (!email || !password || !role) {
        return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user in Supabase
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });

    // Insert user role into database
    await supabase.from("users").insert([{ email, role }]);

    return res.status(201).json({ message: "User registered successfully!" });
});

// ✅ Route: User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide email and password" });
    }

    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ error: "Invalid credentials" });

    // Get user role
    const { data: userData } = await supabase.from("users").select("role").eq("email", email).single();

    // Generate JWT token
    const token = jwt.sign({ email, role: userData.role }, JWT_SECRET, { expiresIn: "24h" });

    return res.status(200).json({ message: "Login successful", token });
});

// ✅ Route: Get User Info (Protected)
router.get("/user", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.status(200).json(decoded);
    } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
});

export default router;
