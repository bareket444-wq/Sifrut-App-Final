import React, { useState, useEffect } from "react";
import "./styles.css";

import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db, studentDocId } from "./firebase";
import { worksDatabase, circles } from "./data/works";

import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import CircleScreen from "./components/CircleScreen";
import WorkScreen from "./components/WorkScreen";
import Toolbox from "./components/Toolbox";
import AiProject from "./components/AiProject";
import AdminPanel from "./components/AdminPanel";
import Popup from "./components/Popup";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("app_isLoggedIn") === "true"
  );
  const [studentName, setStudentName] = useState(
    () => localStorage.getItem("app_studentName") || ""
  );

  // 👩‍🏫 הזיהוי החכם למורה: אם הקלדת "ברקת" או שילוב עם השם, את מזוהה כאדמין!
  const isAdmin = studentName.includes("ברקת");

  // סטייטים של המנעולים - מתחילים מברירת מחדל ואז יתעדכנו מהענן
  const [unlockedCircles, setUnlockedCircles] = useState(["personal"]);
  const [unlockedWorks, setUnlockedWorks] = useState(["zelda_name"]);

  const [currentScreen, setCurrentScreen] = useState("home");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // ⭐ הכוכבים נשמרים בענן לכל תלמיד/ה — ההתקדמות לא מתאפסת יותר ברענון!
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem("app_stars");
    return saved ? parseInt(saved, 10) : 0;
  });

  // ☁️ האזנה לענן של Firebase בזמן אמת - מנעולים
  useEffect(() => {
    if (isLoggedIn) {
      const unsub = onSnapshot(doc(db, "settings", "locks"), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.unlockedCircles) setUnlockedCircles(data.unlockedCircles);
          if (data.unlockedWorks) setUnlockedWorks(data.unlockedWorks);
        } else if (isAdmin) {
          // אם זה הפעם הראשונה אי פעם שהאפליקציה עולה, נקים את מסד הנתונים
          setDoc(doc(db, "settings", "locks"), {
            unlockedCircles: ["personal"],
            unlockedWorks: ["zelda_name", "somek_stutter"],
          });
        }
      });
      return () => unsub();
    }
  }, [isLoggedIn, isAdmin]);

  // ☁️ האזנה לענן - הכוכבים וההתקדמות של התלמיד/ה
  useEffect(() => {
    if (isLoggedIn && studentName) {
      const studentRef = doc(db, "students", studentDocId(studentName));
      const unsub = onSnapshot(studentRef, (docSnap) => {
        if (docSnap.exists()) {
          const cloudStars = docSnap.data().stars;
          if (typeof cloudStars === "number") {
            setStars(cloudStars);
            localStorage.setItem("app_stars", String(cloudStars));
          }
        } else {
          // תלמיד/ה חדש/ה בענן — נרשום את מה שנצבר עד עכשיו במכשיר (אם יש)
          const local = parseInt(localStorage.getItem("app_stars") || "0", 10);
          setDoc(
            studentRef,
            { name: studentName, stars: local },
            { merge: true }
          );
        }
      });
      return () => unsub();
    }
  }, [isLoggedIn, studentName]);

  // ⭐ הוספת כוכבים — מעדכן גם את הענן
  const awardStars = async (amount) => {
    const next = stars + amount;
    setStars(next);
    localStorage.setItem("app_stars", String(next));
    try {
      await setDoc(
        doc(db, "students", studentDocId(studentName)),
        { name: studentName, stars: next },
        { merge: true }
      );
    } catch (err) {
      console.error("שגיאה בשמירת כוכבים:", err);
    }
  };

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setStudentName(name);
    localStorage.setItem("app_isLoggedIn", "true");
    localStorage.setItem("app_studentName", name);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentName("");
    localStorage.removeItem("app_isLoggedIn");
    localStorage.removeItem("app_studentName");
    localStorage.removeItem("app_stars");
    setCurrentScreen("home");
  };

  // ☁️ פונקציות העדכון לענן (נשלחות ישר ל-Firebase)
  const toggleCircleUnlock = async (circleKey) => {
    const updated = unlockedCircles.includes(circleKey)
      ? unlockedCircles.filter((c) => c !== circleKey)
      : [...unlockedCircles, circleKey];
    setUnlockedCircles(updated); // מתעדכן מיד אצלך
    await setDoc(
      doc(db, "settings", "locks"),
      { unlockedCircles: updated },
      { merge: true }
    ); // מעדכן את כל התלמידים בכיתה
  };

  const toggleWorkUnlock = async (workId) => {
    const updated = unlockedWorks.includes(workId)
      ? unlockedWorks.filter((w) => w !== workId)
      : [...unlockedWorks, workId];
    setUnlockedWorks(updated);
    await setDoc(
      doc(db, "settings", "locks"),
      { unlockedWorks: updated },
      { merge: true }
    );
  };

  const handleLockedClick = (
    msg = "הפרק הזה עדיין נעול. התאזרו בסבלנות עד לשיעור!"
  ) => {
    setPopupMessage(msg);
    setShowPopup(true);
  };

  const openWorkScreen = (workId) => {
    setSelectedWorkId(workId);
    setCurrentScreen("workScreen");
  };

  const popup = showPopup ? (
    <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
  ) : null;

  // 🚪 מסך התחברות
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // 📖 מסך תוכן יצירה
  if (currentScreen === "workScreen" && selectedWorkId) {
    const workData = worksDatabase[selectedWorkId];
    return (
      <WorkScreen
        key={selectedWorkId}
        workData={workData}
        studentName={studentName}
        onBack={() => setCurrentScreen(workData.circle)}
        onAwardStars={awardStars}
      />
    );
  }

  // 🧰 מסכי עזר
  if (currentScreen === "toolbox") {
    return <Toolbox onBack={() => setCurrentScreen("home")} />;
  }
  if (currentScreen === "aiProject") {
    return <AiProject onBack={() => setCurrentScreen("socialIdentity")} />;
  }

  // 🎡 מסכי המעגלים
  const activeCircle = circles.find((c) => c.screen === currentScreen);
  if (activeCircle) {
    return (
      <CircleScreen
        circle={activeCircle}
        isAdmin={isAdmin}
        unlockedWorks={unlockedWorks}
        onToggleWork={toggleWorkUnlock}
        onOpenWork={openWorkScreen}
        onLockedClick={handleLockedClick}
        onBack={() => setCurrentScreen("home")}
        onOpenAiProject={() => setCurrentScreen("aiProject")}
      >
        {popup}
      </CircleScreen>
    );
  }

  // 🏠 מסך הבית
  return (
    <HomeScreen
      studentName={studentName}
      stars={stars}
      isAdmin={isAdmin}
      unlockedCircles={unlockedCircles}
      onToggleCircle={toggleCircleUnlock}
      onOpenCircle={setCurrentScreen}
      onLockedClick={handleLockedClick}
      onOpenToolbox={() => setCurrentScreen("toolbox")}
      onOpenAdminPanel={() => setShowAdminPanel(true)}
      onLogout={handleLogout}
    >
      {showAdminPanel && (
        <AdminPanel
          unlockedWorks={unlockedWorks}
          onToggleWork={toggleWorkUnlock}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
      {popup}
    </HomeScreen>
  );
}

export default App;
