// ☁️ חיבור מרכזי ל-Firebase — כל האפליקציה משתמשת בקובץ הזה
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxAbhrb5tV_KYat95aTCuKdqGzOvSlJL4",
  authDomain: "zilberman-cbfc8.firebaseapp.com",
  projectId: "zilberman-cbfc8",
  storageBucket: "zilberman-cbfc8.firebasestorage.app",
  messagingSenderId: "712343724448",
  appId: "1:712343724448:web:b8e2e4b0050fa3b1edc4c5",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// שם תלמיד -> מזהה מסמך בטוח ב-Firestore (בלי תווים אסורים)
export const studentDocId = (name) =>
  name.trim().replace(/[/\\.#$[\]]/g, "_");
