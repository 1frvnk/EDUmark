# EduMark – Student Attendance Management System

## Folder Structure

```
edumark/
├── index.html                  ← Login page (entry point)
├── firestore.rules             ← Firestore security rules
├── README.md
│
├── css/
│   └── style.css               ← Global styles & design tokens
│
├── js/
│   ├── firebase-config.js      ← Firebase init (ADD YOUR KEYS HERE)
│   └── auth.js                 ← Login, logout, route guard
│
└── pages/
    ├── admin/
    │   ├── dashboard.html      ← Admin home
    │   ├── students.html       ← Manage students
    │   ├── teachers.html       ← Manage teachers
    │   ├── classes.html        ← Manage classes
    │   └── reports.html        ← View & export reports
    │
    ├── teacher/
    │   ├── dashboard.html      ← Teacher home
    │   ├── generate-qr.html    ← Generate QR for a session
    │   ├── live-view.html      ← Real-time attendance list
    │   └── reports.html        ← Teacher's class reports
    │
    └── student/
        ├── dashboard.html      ← Student home + attendance %
        └── scan.html           ← QR code scanner page
```

---

## Setup Instructions

### Step 1 – Create a Firebase project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `edumark`
3. Disable Google Analytics (not needed) → **Create project**

### Step 2 – Enable Authentication
1. In Firebase Console → **Authentication** → **Get started**
2. Enable **Email/Password** provider → Save

### Step 3 – Create Firestore database
1. **Firestore Database** → **Create database**
2. Choose **Production mode** → Select a location close to Ghana (e.g. `europe-west1`) → Done

### Step 4 – Add your Firebase config
1. Firebase Console → ⚙️ Project Settings → **Your apps** → Web app (`</>`)
2. Register app (name it `edumark-web`)
3. Copy the `firebaseConfig` object
4. Paste it into `js/firebase-config.js` replacing the placeholder values

### Step 5 – Deploy Firestore rules
```bash
npm install -g firebase-tools
firebase login
firebase init    # choose Firestore + Hosting
firebase deploy --only firestore:rules
```

### Step 6 – Create the first Admin user
1. Firebase Console → Authentication → **Add user**
2. Enter admin email + password
3. Firestore → **users** collection → **Add document**
   - Document ID = the UID shown in Authentication
   - Fields: `name` (string), `email` (string), `role` = `"admin"`

### Step 7 – Deploy the app
```bash
firebase deploy --only hosting
```

---

## Tech Stack

| Layer | Tool |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (ES Modules) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| QR Generate | qrcode.js (CDN) |
| QR Scan | html5-qrcode (CDN) |
| Export PDF | jsPDF (CDN) |
| Export Excel | SheetJS / xlsx (CDN) |
| Hosting | Firebase Hosting |
