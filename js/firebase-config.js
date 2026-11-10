import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyCNkdsf9qV0IsKFkxs3naPx8pMx-rZVB4E",
  authDomain:        "edumark-b164b.firebaseapp.com",
  projectId:         "edumark-b164b",
  storageBucket:     "edumark-b164b.firebasestorage.app",
  messagingSenderId: "30785679083",
  appId:             "1:30785679083:web:dc9c72d9e1179c345f98ae"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);