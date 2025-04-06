const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    password: String,
    agree: Boolean
});

// Create User Model
const User = mongoose.model("User", userSchema);

// GET Routes
// Default Route - Serve login.html directly
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/index", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/create-account", (req, res) => res.sendFile(path.join(__dirname, "public", "create-account.html")));
app.get("/legal", (req, res) => res.sendFile(path.join(__dirname, "public", "legal.html")));

// POST route to handle user registration
app.post("/create-account", async (req, res) => {
    const { fullname, email, password, confirmPassword, agree } = req.body;

    if (password !== confirmPassword) {
        return res.send("❌ Passwords do not match. Please go back and try again.");
    }

    if (!agree) {
        return res.send("❌ You must agree to the Terms and Privacy Policy.");
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send("❌ Email is already registered. Try another.");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ fullname, email, password: hashedPassword, agree: true });
        await newUser.save();

        console.log("✅ New account created:", newUser);

        res.send(`
            <h2>✅ Account Created Successfully!</h2>
            <p>Welcome, ${fullname}!</p>
            <a href="/login">Go to Login</a>
        `);
    } catch (err) {
        console.error("❌ Error saving user:", err);
        res.send("❌ Error creating account. Please try again.");
    }
});

// POST route to handle user login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.send("❌ No account found with this email. Please register first.");
        }

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send("❌ Incorrect password. Please try again.");
        }

        res.redirect("/legal");
    } catch (err) {
        console.error("❌ Error during login:", err);
        res.send("❌ Error logging in. Please try again.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
