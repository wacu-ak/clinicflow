import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBE2HceHJKeVcr5MUYTK9y2opGb8OrOJR8",
  authDomain: "clinicflow-6c1b6.firebaseapp.com",
  projectId: "clinicflow-6c1b6",
  storageBucket: "clinicflow-6c1b6.firebasestorage.app",
  messagingSenderId: "546532060945",
  appId: "1:546532060945:web:d477b893764a1a47a226b0"
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth (app);
export const db = getFirestore(app);

export default app