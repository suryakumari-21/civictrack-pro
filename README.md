# CivicTrack Pro – Citizen Grievance Tracker

> A full-stack local governance transparency platform built with React.js and Firebase.

**Live Demo:** [https://suryakumari-21.github.io/civictrack-pro/](https://suryakumari-21.github.io/civictrack-pro/)

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Router v6 |
| Backend / Auth | Firebase Authentication |
| Database | Firebase Firestore (real-time) |
| Hosting | GitHub Pages |
| Notifications | React Hot Toast |

---

## Project Structure

```
civictrack-pro/
├── public/
│   └── index.html
├── src/
│   ├── firebase/
│   │   └── config.js          # Firebase configuration
│   ├── context/
│   │   └── AuthContext.js     # Auth state management
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── StatCard.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ComplaintCard.jsx
│   │   └── ThreadModal.jsx
│   ├── pages/
│   │   ├── AuthPage.jsx       # Login & Register
│   │   ├── CitizenDash.jsx    # Citizen dashboard
│   │   └── AdminDash.jsx      # Admin control panel
│   ├── styles/
│   │   └── global.css
│   ├── App.js
│   └── index.js
├── .env.example               # Environment variables template
├── .gitignore
└── package.json
```

---

## ✨ Features

- 🔐 **Firebase Authentication** — Secure login & registration
- 👥 **Dual Role System** — Citizen & Admin with protected routes
- 📤 **Submit Complaints** — Category, location, description
- 🔄 **Real-time Status** — Pending → In Progress → Resolved
- 📝 **Admin Notes** — Visible to citizens after update
- 💬 **Discussion Threads** — Real-time per-complaint messaging
- 📊 **Live Dashboard** — Stats update instantly via Firestore
- 🔍 **Search & Filter** — Filter by status, search by keyword

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/suryakumari-21/civictrack-pro.git
cd civictrack-pro
npm install
```

### 2. Create Firebase Project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project → name it `civictrack-pro`
3. Enable **Authentication** → Email/Password
4. Enable **Firestore Database** → Start in test mode
5. Go to Project Settings → Web App → Copy config

### 3. Configure Environment Variables
```bash
cp .env.example .env
```
Fill in your Firebase config values in `.env`

### 4. Add Firestore Security Rules
In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    match /complaints/{id} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    match /threads/{id} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run locally
```bash
npm start
```

### 6. Deploy to GitHub Pages
```bash
npm run deploy
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@civic.gov` | `admin123` |
| Admin Key | — | `CIVIC2024` |

*(Register a new admin account using the key above)*

---

## 📄 License
MIT
