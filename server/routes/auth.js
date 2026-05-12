// routes/auth.js - Register & Login API
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// ─── POST /api/auth/register ──────────────────────────────────────────────────
// Android: call with JSON body
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, phone, location,
      budget, gender, diet, personality, schedule, bio
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !gender || !diet || !personality || !schedule) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, gender, diet, personality, schedule'
      });
    }

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `INSERT INTO users (name, email, password, phone, location, budget, gender, diet, personality, schedule, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone || null, location || null,
       budget || 0, gender, diet, personality, schedule, bio || null]
    );

    // Generate JWT
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: { id: result.insertId, name, email, gender, diet, personality, schedule, location, budget }
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Android: call with { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    // Find user
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id, name: user.name, email: user.email,
        gender: user.gender, diet: user.diet,
        personality: user.personality, schedule: user.schedule,
        location: user.location, budget: user.budget
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
