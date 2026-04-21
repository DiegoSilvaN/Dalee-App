import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDcnnnxTt-QhX0UN3SbnOfxdYg8cpwu0fc",
  authDomain: "dalee-4bd5f.firebaseapp.com",
  projectId: "dalee-4bd5f",
  storageBucket: "dalee-4bd5f.firebasestorage.app",
  messagingSenderId: "84223217683",
  appId: "1:84223217683:web:ee74fa934ef29ad3442fe6",
  measurementId: "G-K52G8SMR3M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
