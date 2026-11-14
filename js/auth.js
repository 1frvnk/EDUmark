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

const ROLE_REDIRECT = {
  admin: "/pages/admin/dashboard.html",
  teacher: "/pages/teacher/dashboard.html",
  student: "/pages/student/dashboard.html"
};

// GET USER PROFILE
export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));

  if (!snapshot.exists()) {
    throw new Error("User profile not found.");
  }

  return snapshot.data();
}

// GET USER ROLE
export async function getUserRole(uid) {
  const profile = await getUserProfile(uid);
  return profile.role;
}

// CHECK STUDENT ACCESS
function isStudentAllowed(profile) {
  if (profile.role !== "student") {
    return true;
  }

  // Allow existing students created before approval system.
  if (!Object.prototype.hasOwnProperty.call(profile, "accountStatus")) {
    return true;
  }

  return profile.accountStatus === "approved";
}

// STUDENT ACCESS MESSAGE
function getStudentAccessMessage(status) {
  const messages = {
    pending: "Your account is awaiting administrator approval.",
    rejected: "Your registration application has been rejected. Please contact the administrator.",
    suspended: "Your account has been suspended. Please contact the administrator.",
    approved: "Your account is approved.",
    approve: "Your account has an invalid approval status. Please contact the administrator."
  };

  return messages[status] ||
    "Your student account is not approved. Please contact the administrator.";
}

// LOGIN USER
export async function loginUser(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = credential.user;
    const profile = await getUserProfile(user.uid);

    if (!isStudentAllowed(profile)) {
      const status = profile.accountStatus;

      await signOut(auth);
      alert(getStudentAccessMessage(status));
      return;
    }

    const destination = ROLE_REDIRECT[profile.role];

    if (!destination) {
      await signOut(auth);

      alert("Your account has an invalid role. Please contact the administrator.");
      return;
    }

    window.location.href = destination;

  } catch (error) {
    console.error("Login error:", error);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      alert("Incorrect email or password.");
    } else {
      alert(error.message || "Unable to log in. Please try again.");
    }
  }
}

// LOGOUT USER
export async function logoutUser() {
  await signOut(auth);
  window.location.href = "/index.html";
}

// PROTECT PAGES
export function guardPage(allowedRoles) {
  const allowed = Array.isArray(allowedRoles)
    ? allowedRoles
    : [allowedRoles];

  let checking = false;

  onAuthStateChanged(auth, async (user) => {
    if (checking) return;

    if (!user) {
      window.location.href = "/index.html";
      return;
    }

    checking = true;

    try {
      const profile = await getUserProfile(user.uid);

      if (!allowed.includes(profile.role)) {
        window.location.href =
          ROLE_REDIRECT[profile.role] || "/index.html";

        return;
      }

      if (!isStudentAllowed(profile)) {
        alert(getStudentAccessMessage(profile.accountStatus));

        await signOut(auth);
        window.location.href = "/index.html";

        return;
      }

    } catch (error) {
      console.error("Page access error:", error);

      alert(
        "Unable to verify your account. Please check your connection or contact the administrator."
      );

    } finally {
      checking = false;
    }
  });
}

// ATTACH LOGOUT BUTTON
export function attachLogout(btnId = "logoutBtn") {
  const button = document.getElementById(btnId);

  if (button) {
    button.addEventListener("click", logoutUser);
  }
}