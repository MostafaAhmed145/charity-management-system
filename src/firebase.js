
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

 const firebaseConfig = {
  apiKey: "AIzaSyCuI4JTpt0IvYPNFYrOz1v14vlbCCoFSso",
  authDomain: "charity-management-syste-26444.firebaseapp.com",
  projectId: "charity-management-syste-26444",
  storageBucket: "charity-management-syste-26444.firebasestorage.app",
  messagingSenderId: "719386031987",
  appId: "1:719386031987:web:20b1a90194ab701a5bb706",
  measurementId: "G-YLJ0CKY15T"
};




const app = initializeApp(firebaseConfig);

export default app

export  const auth = getAuth(app)

export const db = getFirestore(app)

