// ============================================================
//  EduMark – Authentication & Role-Based Routing
// ============================================================

import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Role → Dashboard page map ─────────────────────────────────────
const ROLE_REDIRECT = {
  admin:   "/pages/admin/dashboard.html",
  teacher: "/pages/teacher/dashboard.html",
  student: "/pages/student/dashboard.html"
};

// ── Fetch user role from Firestore ────────────────────────────────
export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("User profile not found.");
  return snap.data().role; // "admin" | "teacher" | "student"
}

// ── Login ─────────────────────────────────────────────────────────
export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const role = await getUserRole(credential.user.uid);
  window.location.href = ROLE_REDIRECT[role] || "/index.html";
}

// ── Logout ────────────────────────────────────────────────────────
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "/index.html";
}

// ── Route guard: call on every protected page ─────────────────────
//    Pass the allowed role(s) for that page, e.g. guardPage("admin")
//    or guardPage(["admin","teacher"])
export function guardPage(allowedRoles) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/index.html";
      return;
    }
    try {
      const role = await getUserRole(user.uid);
      const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (!allowed.includes(role)) {
        // Wrong role — send to their own dashboard
        window.location.href = ROLE_REDIRECT[role] || "/index.html";
      }
    } catch {
      window.location.href = "/index.html";
    }
  });
}

// ── Attach logout button on any page ─────────────────────────────
export function attachLogout(btnId = "logoutBtn") {
  const btn = document.getElementById(btnId);
  if (btn) btn.addEventListener("click", logoutUser);
}
