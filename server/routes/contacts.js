const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// POST /api/contacts/request — send request
router.post('/request', auth, async (req, res) => {
  try {
    const { receiver_id, message } = req.body;
    const sender_id = req.user.id;
    if (!receiver_id) return res.status(400).json({ success: false, message: 'receiver_id required' });
    if (sender_id === Number(receiver_id)) return res.status(400).json({ success: false, message: 'Cannot send to yourself' });

    // Check duplicate in either direction
    const [existing] = await db.query(
      'SELECT id FROM contact_requests WHERE ((sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?)) AND status="pending"',
      [sender_id, receiver_id, receiver_id, sender_id]
    );
    if (existing.length > 0) return res.status(409).json({ success: false, message: 'Request already sent' });

    // Check already connected
    const [connected] = await db.query(
      'SELECT id FROM contact_requests WHERE ((sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?)) AND status="accepted"',
      [sender_id, receiver_id, receiver_id, sender_id]
    );
    if (connected.length > 0) return res.status(409).json({ success: false, message: 'Already connected' });

    await db.query(
      'INSERT INTO contact_requests (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message || null]
    );
    return res.status(201).json({ success: true, message: 'Request sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contacts/requests — INCOMING requests (where I am receiver)
router.get('/requests', auth, async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT cr.id, cr.message, cr.status, cr.created_at,
              u.id as sender_id, u.name as sender_name,
              u.location, u.budget, u.gender, u.diet, u.personality, u.schedule
       FROM contact_requests cr
       JOIN users u ON cr.sender_id = u.id
       WHERE cr.receiver_id = ?
       ORDER BY cr.created_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contacts/sent — SENT requests (where I am sender)
router.get('/sent', auth, async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT cr.id, cr.message, cr.status, cr.created_at,
              u.id as receiver_id, u.name as receiver_name,
              u.location, u.budget, u.gender, u.diet, u.personality, u.schedule
       FROM contact_requests cr
       JOIN users u ON cr.receiver_id = u.id
       WHERE cr.sender_id = ?
       ORDER BY cr.created_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, requests });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/contacts/connections — ALL accepted connections (both directions, deduplicated)
router.get('/connections', auth, async (req, res) => {
  try {
    const myId = req.user.id;
    const [rows] = await db.query(
      `SELECT 
        cr.id as request_id,
        CASE WHEN cr.sender_id = ? THEN cr.receiver_id ELSE cr.sender_id END as user_id,
        CASE WHEN cr.sender_id = ? THEN u2.name ELSE u1.name END as user_name
       FROM contact_requests cr
       JOIN users u1 ON cr.sender_id = u1.id
       JOIN users u2 ON cr.receiver_id = u2.id
       WHERE (cr.sender_id = ? OR cr.receiver_id = ?) AND cr.status = 'accepted'`,
      [myId, myId, myId, myId]
    );
    // Deduplicate by user_id
    const seen = new Set();
    const connections = rows.filter(r => {
      if (seen.has(r.user_id)) return false;
      seen.add(r.user_id); return true;
    });
    return res.json({ success: true, connections });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/contacts/request/:id — accept or reject
router.put('/request/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    await db.query(
      'UPDATE contact_requests SET status=? WHERE id=? AND receiver_id=?',
      [status, req.params.id, req.user.id]
    );
    return res.json({ success: true, message: `Request ${status}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
