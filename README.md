# Roomie-Connect

Roomie Connect is a full-stack roommate finding and communication platform designed to help users discover compatible roommates, send connection requests, manage profiles, and communicate through an integrated chat system.

The project follows a modular architecture with separate frontend, backend API routes, authentication handling, database integration, and user interaction workflows.

---

# Workflow Architecture

User Registration/Login → Authentication → Profile Creation → Search Roommates → Send Requests → Accept Connections → Chat & Communication

---

# Repository Layout

```bash
roomie-fullstack/
│
├── server/
│   ├── public/                 # Frontend HTML pages
│   │   ├── index.html
│   │   ├── register.html
│   │   ├── home.html
│   │   ├── search.html
│   │   ├── profile.html
│   │   ├── profiles.html
│   │   ├── requests.html
│   │   ├── chat.html
│   │   └── api.js
│   │
│   ├── routes/                 # Backend API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── contacts.js
│   │   └── messages.js
│   │
│   ├── server.js               # Main Express server
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

# Features

## Authentication System
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Secure Session Handling

## User Management
- Create Profile
- Update User Information
- View Other Profiles
- Search Compatible Roommates

## Roommate Connection System
- Send Connection Requests
- Accept/Reject Requests
- Manage Connections

## Messaging System
- One-to-One Chat
- Message Storage
- Real-Time Style Chat Interface

## Database Integration
- MySQL Database Connectivity
- Persistent User Data
- Request & Message Storage

---

# Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MySQL

## Authentication
- JWT (JSON Web Tokens)

---

# Local Development Setup

## Prerequisites

Install the following:

- Node.js
- npm
- MySQL Server
- Git

---

# 1) Clone Repository

```bash
git clone https://github.com/TammanaSesharathnam/Roomie-Fullstack.git
```

---

# 2) Navigate to Project Folder

```bash
cd roomie-fullstack/server
```

---

# 3) Install Dependencies

```bash
npm install
```

---

# 4) Configure Environment Variables

Create a `.env` file inside the `server/` folder:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=roomie_connect

JWT_SECRET=roomie_connect_super_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://127.0.0.1:5500
```

---

# 5) Create MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE roomie_connect;
```

---

# 6) Start Backend Server

```bash
npm start
```

Expected output:

```bash
Server running on port 3000
Connected to MySQL database
```

---

# 7) Open Application

Visit:

```text
http://localhost:3000
```

---

# API Modules

## Authentication Routes
Handles:
- User Registration
- Login
- JWT Token Generation

File:
```bash
server/routes/auth.js
```

---

## User Routes
Handles:
- Profile Fetching
- User Search
- Profile Management

File:
```bash
server/routes/users.js
```

---

## Contact Routes
Handles:
- Sending Requests
- Accepting Requests
- Connection Management

File:
```bash
server/routes/contacts.js
```

---

## Message Routes
Handles:
- Sending Messages
- Fetching Chat History

File:
```bash
server/routes/messages.js
```

---

# Frontend Pages

| Page | Description |
|------|-------------|
| index.html | Landing Page |
| register.html | User Registration |
| home.html | Dashboard |
| search.html | Search Roommates |
| profile.html | User Profile |
| profiles.html | Other User Profiles |
| requests.html | Connection Requests |
| chat.html | Messaging System |

---

# Future Improvements

- Real-Time Messaging using Socket.IO
- Image Upload Support
- Advanced Roommate Matching Algorithm
- Email Notifications
- Mobile Responsive UI
- Dark Mode
- Cloud Deployment
- OAuth Login (Google/GitHub)

---

# Security Considerations

- JWT-based Authentication
- Password Protection
- Protected Backend Routes
- Environment Variable Configuration

---

# Future Deployment Options

- Frontend: Vercel / Netlify
- Backend: Render / Railway
- Database: MySQL Cloud / PlanetScale
---
# Disclaimer

This project is developed for educational and learning purposes.  
It demonstrates full-stack web development concepts including authentication, REST APIs, database integration, and user communication systems.
