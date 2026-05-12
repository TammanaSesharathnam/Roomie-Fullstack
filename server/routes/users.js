// routes/users.js - Profile & Search API (Android-Ready)
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// ─── GET /api/users/search ────────────────────────────────────────────────────
// Filter roommates by preferences
// Android Query: /api/users/search?gender=female&diet=veg&personality=introvert&schedule=morningbird&location=Guntur&maxBudget=3000
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { gender, diet, personality, schedule, location, maxBudget, minBudget } = req.query;

    let query = 'SELECT id, name, email, location, budget, gender, diet, personality, schedule, bio FROM users WHERE id != ?';
    const params = [req.user.id];

    if (gender)      { query += ' AND gender = ?';      params.push(gender); }
    if (diet)        { query += ' AND diet = ?';         params.push(diet); }
    if (personality) { query += ' AND personality = ?';  params.push(personality); }
    if (schedule)    { query += ' AND schedule = ?';     params.push(schedule); }
    if (location)    { query += ' AND location LIKE ?';  params.push(`%${location}%`); }
    if (maxBudget)   { query += ' AND budget <= ?';      params.push(Number(maxBudget)); }
    if (minBudget)   { query += ' AND budget >= ?';      params.push(Number(minBudget)); }

    query += ' ORDER BY created_at DESC';

    const [users] = await db.query(query, params);

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/users/profile ───────────────────────────────────────────────────
// Get logged-in user's own profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, phone, location, budget, gender, diet, personality, schedule, bio, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: rows[0] });

  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── PUT /api/users/profile ───────────────────────────────────────────────────
// Update logged-in user's profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, location, budget, gender, diet, personality, schedule, bio } = req.body;

    await db.query(
      `UPDATE users SET name=?, phone=?, location=?, budget=?, gender=?, diet=?, personality=?, schedule=?, bio=?
       WHERE id=?`,
      [name, phone, location, budget, gender, diet, personality, schedule, bio, req.user.id]
    );

    return res.status(200).json({ success: true, message: 'Profile updated successfully' });

  } catch (err) {
    console.error('Update error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
// View another user's public profile
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, location, budget, gender, diet, personality, schedule, bio FROM users WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: rows[0] });

  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
