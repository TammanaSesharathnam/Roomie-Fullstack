// server.js - Roomie Connect Main Server
// Android-ready REST API with CORS support
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5500',
    'http://localhost:3000',
    'http://10.0.2.2:3000',  // Android Emulator → localhost
    '*'                       // Remove in production; use specific origins
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve Static Web Client ───────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, '../client')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/messages', require('./routes/messages'));

// ── Health Check (useful for Android to test connectivity) ────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Roomie Connect API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// ── Catch-all: Serve web client for non-API routes ────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Roomie Connect Server running on http://localhost:${PORT}`);
  console.log(`📱 Android Emulator URL: http://10.0.2.2:${PORT}`);
  console.log(`🌐 Web Client: http://localhost:${PORT}`);
  console.log(`🔑 API Base: http://localhost:${PORT}/api`);
});
