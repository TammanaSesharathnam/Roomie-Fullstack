// routes/messages.js - Real server-side chat messages
const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// GET /api/messages/:userId — get conversation between me and another user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;

    // Verify they are connected (accepted request)
    const [conn] = await db.query(
      `SELECT id FROM contact_requests 
       WHERE status='accepted' AND (
         (sender_id=? AND receiver_id=?) OR 
         (sender_id=? AND receiver_id=?)
       )`,
      [myId, otherId, otherId, myId]
    );
    if (!conn.length) {
      return res.status(403).json({ success: false, message: 'Not connected with this user' });
    }

    const [messages] = await db.query(
      `SELECT id, sender_id, receiver_id, message, created_at 
       FROM messages 
       WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?)
       ORDER BY created_at ASC`,
      [myId, otherId, otherId, myId]
    );

    return res.json({ success: true, messages });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/messages/:userId — send a message
router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    const myId = req.user.id;
    const otherId = req.params.userId;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    // Verify connected
    const [conn] = await db.query(
      `SELECT id FROM contact_requests 
       WHERE status='accepted' AND (
         (sender_id=? AND receiver_id=?) OR 
         (sender_id=? AND receiver_id=?)
       )`,
      [myId, otherId, otherId, myId]
    );
    if (!conn.length) {
      return res.status(403).json({ success: false, message: 'Not connected with this user' });
    }

    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [myId, otherId, message.trim()]
    );

    return res.status(201).json({ 
      success: true, 
      message: { id: result.insertId, sender_id: myId, receiver_id: otherId, message: message.trim(), created_at: new Date() }
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
