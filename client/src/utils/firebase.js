
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "exam-notes-9353e.firebaseapp.com",
  projectId: "exam-notes-9353e",
  storageBucket: "exam-notes-9353e.firebasestorage.app",
  messagingSenderId: "875979760046",
  appId: "1:875979760046:web:d4bc97b1e7dc587a60283f",
  measurementId: "G-P8M0ZVX824"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}