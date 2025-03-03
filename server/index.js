const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('./model/user');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Configure session
app.use(session({
    secret: process.env.SESSION_SECRET || "default-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production (HTTPS)
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB Connection Failed:", err));

// Signup Route (Fixed)
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(409).json({ error: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Route (Fixed)
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Google OAuth Routes (Fixed)
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await UserModel.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new UserModel({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: "google-auth"
            });
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/signup" }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });
        res.redirect(process.env.FRONTEND_URL + "/home");
    }
);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});