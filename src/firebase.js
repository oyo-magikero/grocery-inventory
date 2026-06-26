import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// 🔁 Your config (keep yours here)
const firebaseConfig = {
   apiKey: "AIzaSyBchzMH0M209TYlboZ63GFlKos8R7l5FYI",
  authDomain: "grocery-inventory-6fbff.firebaseapp.com",
  projectId: "grocery-inventory-6fbff",
  storageBucket: "grocery-inventory-6fbff.firebasestorage.app",
  messagingSenderId: "320964554704",
  appId: "1:320964554704:web:15871415e1ae5de83dd3d5"
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Firestore database
export const db = getFirestore(app);