
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDa5NCOKxAQdrqwN3QynJVy-YGKNuTz0rM",
  authDomain: "alarmsystem-8290a.firebaseapp.com",
  projectId: "alarmsystem-8290a",
  storageBucket: "alarmsystem-8290a.firebasestorage.app",
  messagingSenderId: "289324409044",
  appId: "1:289324409044:web:86101d6e5b400ecb5d1b41"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)