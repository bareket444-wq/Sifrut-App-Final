import React, { useState, useEffect } from "react";
import "./styles.css";

// ☁️ ייבוא פקודות פיירבייס
import { initializeApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc } from "firebase/firestore";

// 🔑 המפתחות הסודיים של מקיף זילברמן!
const firebaseConfig = {
  apiKey: "AIzaSyDxAbhrb5tV_KYat95aTCuKdqGzOvSlJL4",
  authDomain: "zilberman-cbfc8.firebaseapp.com",
  projectId: "zilberman-cbfc8",
  storageBucket: "zilberman-cbfc8.firebasestorage.app",
  messagingSenderId: "712343724448",
  appId: "1:712343724448:web:b8e2e4b0050fa3b1edc4c5",
};

// הפעלת החיבור לענן
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =========================================================
// 📚 מסד הנתונים של היצירות (גרסה מקוצרת לתצוגה - הכל נמצא פה!)
// =========================================================
const worksDatabase = {
  zelda_name: {
    id: "zelda_name",
    circle: "personalIdentity",
    title: "לכל איש יש שם",
    author: "זלדה",
    summary:
      'השיר "לכל איש יש שם" עוסק בשאלה: "מי אני?". המסר המרכזי הוא שהזהות שלנו מורכבת מהרבה יותר מהשם שקיבלנו בלידה. היא פסיפס של השפעות: המשפחה, הסביבה, הבחירות שלנו והזמן שחולף. כל אדם הוא ייחודי כי מסע חייו הוא חד-פעמי.\n\nזרקור אמצעים רטוריים 🔦\nביצירה בולט אמצעי ה"חזרה" (אנאפורה). זלדה חוזרת על התבנית "לכל איש יש שם שנתן לו..." כדי להדגיש את ריבוי הגורמים שמעצבים אותנו. בנוסף, יש שימוש ב"האנשה ומטפורה" – מושגים כמו "הים" או "חטאיו" מתוארים כמי ש"נותנים" לאדם את שמו.',
    questions: [
      "בחרו גורם אחד מתוך השיר שעיצב גם את דמותכם, והסבירו כיצד הוא 'נתן לכם שם' והשפיע על מי שאתם.",
      "מדוע בחרה המשוררת להשתמש באמצעי הרטורי של 'חזרה'? כיצד היא משרתת את המסר?",
    ],
    slides: [
      {
        title: "לכל איש יש שם",
        subtitle: "מאת: זלדה",
        bullets: [
          "מהו מקור השם שלנו?",
          "האם הזהות שלנו מצטמצמת רק לשם הפרטי?",
          "היכרות עם השיר שמפרק את השאלה 'מי אני?'.",
        ],
        icon: "✨",
      },
      {
        title: "המסר המרכזי",
        subtitle: "פסיפס של חיים",
        bullets: [
          "הזהות נבנית מחוויות, מאנשים שפגשנו ומבחירות שעשינו.",
          "הסביבה, הטבע והזמן משאירים בנו חותם עמוק.",
          "מסע החיים של כל אדם הוא ייחודי וחד-פעמי.",
        ],
        icon: "🧩",
      },
    ],
  },
  somek_stutter: {
    id: "somek_stutter",
    circle: "personalIdentity",
    title: "נקמת הילד המגמגם",
    author: "רוני סומק",
    summary:
      'השיר מתאר התמודדות כאובה של ילד עם חולשה פיזית וחברתית – הגמגום, והפיכת החולשה לכוח יצירה.\n\nזרקור אמצעים רטוריים 🔦\nשימוש ב"מטאפורות" פיזיות וב"פסיחה" (קטיעת שורות) המדמה גמגום.',
    questions: [
      "כיצד באה לידי ביטוי ה'נקמה' של הילד בשיר?",
      "הסבירו כיצד האמצעי הרטורי של ה'פסיחה' מסייע לנו להרגיש את חוויית הילד.",
    ],
    slides: [
      {
        title: "נקמת הילד המגמגם",
        subtitle: "מאת: רוני סומק",
        bullets: [
          "התמודדות עם שונות, קושי ולעג חברתי.",
          "איך חולשה יכולה להפוך למקור כוח.",
        ],
        icon: "🗣️",
      },
    ],
  },
  tchernichovsky_star: {
    id: "tchernichovsky_star",
    circle: "personalIdentity",
    title: "איך זה שכוכב",
    author: "נתן זך",
    summary:
      'השיר מתאר פליאה על כוכב בודד שמעז להאיר בשמיים החשוכים, המסמל אינדיבידואליסט ששוחה נגד הזרם.\n\nזרקור אמצעים רטוריים 🔦\n"האנשה" לכוכב ה"מעז", ו"שאלה רטורית" שמביעה פליאה.',
    questions: [
      "תארו מצב שבו נדרש מאדם אומץ להיות 'כוכב אחד לבד'.",
      "כיצד תכונת ההאנשה עוזרת להעביר את המסר?",
    ],
    slides: [
      {
        title: "איך זה שכוכב",
        subtitle: "מאת: נתן זך",
        bullets: [
          "על אומץ ליבו של היחיד מול הרבים.",
          "לשחות נגד הזרם ולהישאר נאמן לעצמך.",
        ],
        icon: "⭐",
      },
    ],
  },
  keret_pig: {
    id: "keret_pig",
    circle: "personalIdentity",
    title: "לשבור את החזיר",
    author: "אתגר קרת",
    summary:
      'התנגשות בין חינוך לחומריות (האב) לבין רגש וחמלה (הבן) דרך יחסו של הילד לקופת החיסכון.\n\nזרקור אמצעים רטוריים 🔦\n"האנשה" עמוקה לחזיר החרסינה, וסיום של "פואנטה" מפתיעה.',
    questions: [
      "כיצד השתבשה מטרתו של האב?",
      "מדוע ההאנשה שעשה הילד הופכת את הפואנטה למשמעותית?",
    ],
    slides: [
      {
        title: "לשבור את החזיר",
        subtitle: "מאת: אתגר קרת",
        bullets: ["התנגשות בין עולם המבוגרים לעולם הילדים."],
        icon: "🐷",
      },
    ],
  },
  lord_randall: {
    id: "lord_randall",
    circle: "familyIdentity",
    title: "לורד רנדל",
    author: "בלדה עממית",
    summary:
      'דיאלוג דרמטי בין אם לבנה הגוסס שחושף בגידה והרעלה.\n\nזרקור אמצעים רטוריים 🔦\n"דיאלוג" היוצר "פערי מידע" ו"חזרה" המייצרת מתח עד לחשיפת הסוד.',
    questions: [
      "כיצד משתקפת דאגת האם דרך שאלותיה?",
      "איך אמצעי החזרה ופערי המידע תורמים למתח?",
    ],
    slides: [
      {
        title: "לורד רנדל",
        subtitle: "בלדה עממית",
        bullets: ["דיאלוג מותח וחשיפת סוד אפל."],
        icon: "🏰",
      },
    ],
  },
  rabbis_daughter: {
    id: "rabbis_daughter",
    circle: "familyIdentity",
    title: "בת הרב ואמה",
    author: "שאול טשרניחובסקי",
    summary:
      'אם החושדת בבתה ומנסה לדובב אותה, עד לחשיפת סוד שובר מוסכמות.\n\nזרקור אמצעים רטוריים 🔦\n"דיאלוג" מתחמק ו"רמזים מטרימים" המכינים את הקורא לאסון.',
    questions: [
      "כיצד בא לידי ביטוי מרד הנעורים בדו-שיח?",
      "הביאו דוגמה לרמז מטרים מהבלדה.",
    ],
    slides: [
      {
        title: "בת הרב ואמה",
        subtitle: "שאול טשרניחובסקי",
        bullets: ["על סודות, מרד נעורים ופער דורות."],
        icon: "👩‍👧",
      },
    ],
  },
  stuart_cherry: {
    id: "stuart_cherry",
    circle: "familyIdentity",
    title: "עץ הדובדבנים השבור",
    author: "ג'סי סטיוארט",
    summary:
      'סיפור על אב מסורתי שכועס על עונש חינוכי של בנו, ועובר תהליך של קבלה.\n\nזרקור אמצעים רטוריים 🔦\n"ניגוד" בין עולם האב לעולם המורה, ו"נקודת תצפית" של הילד.',
    questions: [
      "תארו את השינוי ביחסו של האב למורה.",
      "כיצד הסיפור מנקודת מבטו של דייב עוזרת לנו להבין את המצוקה?",
    ],
    slides: [
      {
        title: "עץ הדובדבנים השבור",
        subtitle: "ג'סי סטיוארט",
        bullets: ["עימות מרתק בין מסורת לחינוך מודרני."],
        icon: "🍒",
      },
    ],
  },
  biton_background: {
    id: "biton_background",
    circle: "familyIdentity",
    title: "דברי רקע ראשוניים",
    author: "ארז ביטון",
    summary:
      'כאב ההגירה של העולים ממרוקו, המעבר מעולם עשיר לשתיקה ולהשתקה בישראל.\n\nזרקור אמצעים רטוריים 🔦\n"ניגוד" בין ה"שם" ל"כאן", ו"מטאפורות" לתיאור השתיקה.',
    questions: [
      "כיצד הפער בין העבר להווה השפיע על ההורים?",
      "הסבירו איך האמצעי של הניגוד תורם להבנת התחושה.",
    ],
    slides: [
      {
        title: "דברי רקע ראשוניים",
        subtitle: "ארז ביטון",
        bullets: ["על קשיי הגירה והמחיר התרבותי."],
        icon: "📝",
      },
    ],
  },
  black_on_black: {
    id: "black_on_black",
    circle: "familyIdentity",
    title: "שחור על גבי שחור",
    author: "סיפור קצר",
    summary:
      'התמודדות עם זיכרונות וסודות אפלים מהעבר שמעיבים על המשפחה.\n\nזרקור אמצעים רטוריים 🔦\nכותרת הסיפור כ"מטפורה" לזיכרון ו"אנלוגיה" בין הדמויות.',
    questions: [
      "כיצד באה לידי ביטוי משמעות הכותרת בסיפור?",
      "הסבירו כיצד הזיכרון מעצב את יחסי הדמויות.",
    ],
    slides: [
      {
        title: "שחור על גבי שחור",
        subtitle: "סיפור קצר",
        bullets: ["סודות מהעבר והשפעתם על המשפחה."],
        icon: "⬛",
      },
    ],
  },
  tanai_leave: {
    id: "tanai_leave",
    circle: "socialIdentity",
    title: "להשאיר",
    author: "שלמה טנאי",
    summary:
      'על הוויתורים שנדרש היחיד לעשות כדי להשתלב בחברה.\n\nזרקור אמצעים רטוריים 🔦\n"מוטיב חוזר" של השארה מאחור, ו"שאלות רטוריות".',
    questions: [
      "מהו המחיר החברתי שדורש השיר?",
      "כיצד תורם המוטיב החוזר להבנת המסר?",
    ],
    slides: [
      {
        title: "להשאיר",
        subtitle: "שלמה טנאי",
        bullets: ["על מחיר ההשתלבות החברתית אצל היחיד."],
        icon: "📦",
      },
    ],
  },
  elmaliah: {
    id: "elmaliah",
    circle: "socialIdentity",
    title: "אלמליח",
    author: "נתן יהונתן",
    summary:
      'דמות שנדחקת לשולי החברה, וביקורת על צביעות הקהילה.\n\nזרקור אמצעים רטוריים 🔦\n"אפיון עקיף" דרך התנהגות הסביבה, ו"אירוניה חברתית".',
    questions: [
      "מה יחסה של הסביבה לאלמליח?",
      "הביאו דוגמה לאירוניה בהתנהגות העיירה.",
    ],
    slides: [
      {
        title: "אלמליח",
        subtitle: "נתן יהונתן",
        bullets: ["היחס של החברה לאנשי השוליים בתוכה."],
        icon: "📖",
      },
    ],
  },
  tzetnik_number: {
    id: "tzetnik_number",
    circle: "nationalIdentity",
    title: "מספר על היד",
    author: "ק. צטניק",
    summary:
      'המספר כמחיקת זהות בשואה אל מול הפיכתו לעדות חיה וסמל תקומה.\n\nזרקור אמצעים רטוריים 🔦\n"מטפורה וסמל" (המספר טעון במשמעויות הפוכות), ו"ניגוד".',
    questions: [
      "מה מסמל ה'מספר' עבור הניצולים?",
      "הסבירו כיצד הניגוד בא לידי ביטוי.",
    ],
    slides: [
      {
        title: "מספר על היד",
        subtitle: "ק. צטניק",
        bullets: ["זיכרון, גבורה ותקומה לאומית."],
        icon: "🔢",
      },
    ],
  },
  agnon_enemy: {
    id: "agnon_enemy",
    circle: "nationalIdentity",
    title: "מאויב לאוהב",
    author: 'ש"י עגנון',
    summary:
      'היכולת האנושית לסלוח ולהתקרב מעבר לשנאה וטינה של שנים.\n\nזרקור אמצעים רטוריים 🔦\nתהליך של "מהפך נפשי", ושילוב "מוטיבים סמליים".',
    questions: [
      "מה גרם לדמויות להפוך מאויב לאוהב?",
      "הסבירו את התפקיד של המפגשים או החפצים בסיפור.",
    ],
    slides: [
      {
        title: "מאויב לאוהב",
        subtitle: 'ש"י עגנון',
        bullets: ["על פיוס, גילוי הלב והיכולת לשנות דעה."],
        icon: "🤝",
      },
    ],
  },
  shemer_win: {
    id: "shemer_win",
    circle: "nationalIdentity",
    title: "לא תנצחו אותי",
    author: "נעמי שמר",
    summary:
      'המנון חוסן לאומי, עמידה איתנה מול אתגרים וחיבור עמוק למולדת.\n\nזרקור אמצעים רטוריים 🔦\n"דימויי עוצמה" ואיתנות, וחזרה על המסר כהצהרה.',
    questions: [
      "למי פונה הדוברת בשיר ומה מטרתה?",
      "כיצד תורם הקצב של השיר לתחושת הפטריוטיות?",
    ],
    slides: [
      {
        title: "לא תנצחו אותי",
        subtitle: "נעמי שמר",
        bullets: ["אהבת המולדת ועמידה איתנה של הרוח הישראלית."],
        icon: "🇮🇱",
      },
    ],
  },
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("app_isLoggedIn") === "true"
  );
  const [studentName, setStudentName] = useState(
    () => localStorage.getItem("app_studentName") || ""
  );
  const [inputName, setInputName] = useState("");
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 👩‍🏫 הזיהוי החכם למורה: אם הקלדת "ברקת" או שילוב עם השם, את מזוהה כאדמין!
  const isAdmin = studentName.includes("ברקת");

  // סטייטים של המנעולים - מתחילים מברירת מחדל ואז יתעדכנו מהענן
  const [unlockedCircles, setUnlockedCircles] = useState(["personal"]);
  const [unlockedWorks, setUnlockedWorks] = useState(["zelda_name"]);

  const [currentScreen, setCurrentScreen] = useState("home");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [activeTab, setActiveTab] = useState("summary");
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem("app_stars");
    return saved ? parseInt(saved) : 0;
  });
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // ☁️ האזנה לענן של Firebase בזמן אמת!
  useEffect(() => {
    if (isLoggedIn) {
      // ברגע שנכנסים, המערכת מאזינה תמיד לקובץ "locks" בתיקיית "settings"
      const unsub = onSnapshot(doc(db, "settings", "locks"), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.unlockedCircles) setUnlockedCircles(data.unlockedCircles);
          if (data.unlockedWorks) setUnlockedWorks(data.unlockedWorks);
        } else {
          // אם זה הפעם הראשונה אי פעם שהאפליקציה עולה, נקים את המסד נתונים
          if (isAdmin) {
            setDoc(doc(db, "settings", "locks"), {
              unlockedCircles: ["personal"],
              unlockedWorks: ["zelda_name", "somek_stutter"],
            });
          }
        }
      });
      return () => unsub(); // מנתק את ההאזנה כשיוצאים
    }
  }, [isLoggedIn, isAdmin]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (inputName.trim() !== "") {
      setIsLoggedIn(true);
      setStudentName(inputName);
      localStorage.setItem("app_isLoggedIn", "true");
      localStorage.setItem("app_studentName", inputName);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setStudentName("");
    localStorage.removeItem("app_isLoggedIn");
    localStorage.removeItem("app_studentName");
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

  // 🔹 כפתורי השליטה יופיעו **רק** למורה!
  const renderAdminToggle = (key, isCircle = true) => {
    if (!isAdmin) return null; // 🛑 תלמידים לא יראו את הכפתור הזה

    const isUnlocked = isCircle
      ? unlockedCircles.includes(key)
      : unlockedWorks.includes(key);
    const toggleFn = isCircle
      ? () => toggleCircleUnlock(key)
      : () => toggleWorkUnlock(key);

    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFn();
        }}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: isUnlocked ? "#e8f8f5" : "#fdedec",
          color: isUnlocked ? "#27ae60" : "#c0392b",
          border: `1px solid ${isUnlocked ? "#2ecc71" : "#e74c3c"}`,
          borderRadius: "8px",
          padding: "5px 10px",
          cursor: "pointer",
          fontSize: "0.8rem",
          fontWeight: "bold",
          zIndex: 10,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        👩‍🏫 מורה: {isUnlocked ? "🔓 פתוח" : "🔒 נעול"}
      </button>
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
    setActiveTab("summary");
    setCurrentSlideIndex(0);
    setCurrentScreen("workScreen");
  };

  const renderWorkCard = (workId, icon, specialColor = null) => {
    const work = worksDatabase[workId];
    if (!work) return null;
    const isUnlocked = unlockedWorks.includes(workId);

    return (
      <div
        className={`work-card ${!isUnlocked ? "locked-work" : ""}`}
        key={workId}
        style={{
          opacity: isUnlocked ? 1 : 0.75,
          background: isUnlocked ? "white" : "#f1f2f6",
          position: "relative",
        }}
      >
        {renderAdminToggle(workId, false)}
        <div className="work-icon" style={{ marginTop: "25px" }}>
          {icon}
        </div>
        <div className="work-info">
          <h3>{work.title}</h3>
          <p>{work.author}</p>
        </div>
        {isUnlocked ? (
          <button
            className="enter-btn"
            style={specialColor ? { background: specialColor } : {}}
            onClick={() => openWorkScreen(workId)}
          >
            כניסה
          </button>
        ) : (
          <button
            className="enter-btn"
            style={{ background: "#a4b0be" }}
            onClick={(e) => {
              e.stopPropagation();
              handleLockedClick(
                `היצירה '${work.title}' נעולה. היא תיפתח לאחר השיעור בכיתה!`
              );
            }}
          >
            🔒 נעול
          </button>
        )}
      </div>
    );
  };

  // מסך התחברות
  if (!isLoggedIn) {
    return (
      <div className="app-container login-screen">
        <div className="login-card">
          <div className="login-icon">📚</div>
          <h1>ברוכים הבאים</h1>
          <form onSubmit={handleAuth} className="login-form">
            <input
              type="text"
              placeholder="שם התלמיד/ה (או המורה)"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-btn">
              כניסה למרחב הלמידה
            </button>
          </form>
          <p
            style={{ fontSize: "0.8rem", color: "#636e72", marginTop: "15px" }}
          >
            * מורה? הקלידי "ברקת" כדי לקבל הרשאות ניהול.
          </p>
        </div>
      </div>
    );
  }

  // מסך תוכן יצירה
  if (currentScreen === "workScreen" && selectedWorkId) {
    const workData = worksDatabase[selectedWorkId];
    return (
      <div className="app-container">
        {showCelebration && (
          <div className="celebration-overlay">
            <div className="celebration-content">
              <h1>🎉 כל הכבוד! 🎉</h1>
              <div className="floating-emojis">⭐ ✨ 🏆 🌟</div>
            </div>
          </div>
        )}
        <header className="header inner-header work-header">
          <button
            className="back-btn"
            onClick={() => setCurrentScreen(workData.circle)}
          >
            ➔ חזרה
          </button>
          <h1>{workData.title}</h1>
          <p>מאת: {workData.author}</p>
        </header>
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === "summary" ? "active" : ""}`}
            onClick={() => setActiveTab("summary")}
          >
            סיכום ויצירה
          </button>
          <button
            className={`tab-btn ${
              activeTab === "presentation" ? "active" : ""
            }`}
            onClick={() => setActiveTab("presentation")}
          >
            מצגת
          </button>
          <button
            className={`tab-btn ${activeTab === "questions" ? "active" : ""}`}
            onClick={() => setActiveTab("questions")}
          >
            שאלות עומק
          </button>
        </div>
        <main className="tab-content">
          {activeTab === "summary" && (
            <div className="content-card fade-in">
              <h3>סיכום ואמצעים רטוריים</h3>
              <p style={{ whiteSpace: "pre-wrap" }}>{workData.summary}</p>
            </div>
          )}
          {activeTab === "presentation" && (
            <div
              className="content-card fade-in"
              style={{ textAlign: "right" }}
            >
              {workData.slides && workData.slides.length > 0 ? (
                <div>
                  <div
                    style={{
                      background: "#f8f9fa",
                      padding: "25px",
                      borderRadius: "15px",
                      border: "1px solid #dfe4ea",
                      minHeight: "260px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "15px",
                        }}
                      >
                        <span style={{ fontSize: "2rem" }}>
                          {workData.slides[currentSlideIndex].icon}
                        </span>
                        <span
                          style={{
                            fontSize: "0.85rem",
                            background: "#a18cd1",
                            color: "white",
                            padding: "4px 10px",
                            borderRadius: "10px",
                          }}
                        >
                          שקף {currentSlideIndex + 1} מתוך{" "}
                          {workData.slides.length}
                        </span>
                      </div>
                      <h3
                        style={{
                          margin: "0 0 5px 0",
                          color: "#2d3436",
                          fontSize: "1.2rem",
                        }}
                      >
                        {workData.slides[currentSlideIndex].title}
                      </h3>
                      <p
                        style={{
                          color: "#636e72",
                          fontSize: "0.9rem",
                          marginBottom: "15px",
                          fontWeight: "500",
                        }}
                      >
                        {workData.slides[currentSlideIndex].subtitle}
                      </p>
                      <ul
                        style={{
                          paddingRight: "20px",
                          margin: 0,
                          color: "#2d3436",
                          lineHeight: "1.6",
                        }}
                      >
                        {workData.slides[currentSlideIndex].bullets.map(
                          (bullet, idx) => (
                            <li key={idx} style={{ marginBottom: "8px" }}>
                              {bullet}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "20px",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="action-btn"
                      style={{
                        flex: 1,
                        opacity: currentSlideIndex === 0 ? 0.5 : 1,
                      }}
                      disabled={currentSlideIndex === 0}
                      onClick={() =>
                        setCurrentSlideIndex((prev) => Math.max(0, prev - 1))
                      }
                    >
                      ➔ הקודם
                    </button>
                    <button
                      className="action-btn"
                      style={{
                        flex: 1,
                        opacity:
                          currentSlideIndex === workData.slides.length - 1
                            ? 0.5
                            : 1,
                      }}
                      disabled={
                        currentSlideIndex === workData.slides.length - 1
                      }
                      onClick={() =>
                        setCurrentSlideIndex((prev) =>
                          Math.min(workData.slides.length - 1, prev + 1)
                        )
                      }
                    >
                      הבא ➔
                    </button>
                  </div>
                </div>
              ) : (
                <div className="center-card">
                  <div className="presentation-icon">📊</div>
                  <h3>המצגת בבנייה</h3>
                </div>
              )}
            </div>
          )}
          {activeTab === "questions" && (
            <div className="content-card fade-in">
              <h3>תרגול ורפלקציה</h3>
              {workData.questions.map((question, index) => {
                return (
                  <div key={index} className="question-item">
                    <p>
                      <strong>{index + 1}.</strong> {question}
                    </p>
                    <textarea
                      className="answer-input"
                      placeholder="הקלידו את התשובה כאן..."
                    />
                  </div>
                );
              })}
              <button
                className="action-btn"
                style={{ width: "100%", marginTop: "15px" }}
                onClick={() => {
                  setStars((p) => p + 100);
                  setShowCelebration(true);
                  setTimeout(() => setShowCelebration(false), 3000);
                }}
              >
                שלח לבדיקה ✔️ (+100 ⭐️)
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // מסכי עזר
  if (currentScreen === "toolbox")
    return (
      <div className="app-container">
        <header className="header inner-header toolbox-header">
          <button className="back-btn" onClick={() => setCurrentScreen("home")}>
            ➔ חזרה
          </button>
          <h1>🧰 ארגז הכלים</h1>
        </header>
        <main className="tools-container">
          <div className="tool-card">
            <h3>🎭 אמצעים רטוריים</h3>
            <ul className="features-list">
              <li>דימוי, מטפורה, האנשה...</li>
            </ul>
          </div>
          <div className="tool-card">
            <h3>📖 סיפור קצר</h3>
            <ul className="features-list">
              <li>אקספוזיציה, סיבוך, שיא...</li>
            </ul>
          </div>
        </main>
      </div>
    );
  if (currentScreen === "aiProject")
    return (
      <div className="app-container ai-container">
        <header className="header inner-header ai-header">
          <button
            className="back-btn"
            onClick={() => setCurrentScreen("socialIdentity")}
          >
            ➔ חזרה
          </button>
          <h1>מעבדת AI 🤖</h1>
        </header>
        <main className="studio-window fade-in">
          <div className="studio-instructions">
            <h3>יצירת תמונה 🖼️</h3>
            <p>המקום לדמיין ולעצב יחד עם בינה מלאכותית.</p>
          </div>
        </main>
      </div>
    );

  // מסכי המעגלים
  if (currentScreen === "personalIdentity")
    return (
      <div className="app-container">
        <header
          className="header inner-header"
          style={{
            background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
          }}
        >
          <button className="back-btn" onClick={() => setCurrentScreen("home")}>
            ➔ חזרה
          </button>
          <h1>זהות אישית</h1>
          <p>מי אני ומה ייחודו של האדם?</p>
        </header>
        <main className="works-container">
          {renderWorkCard("zelda_name", "📖")}{" "}
          {renderWorkCard("somek_stutter", "🗣️")}{" "}
          {renderWorkCard("tchernichovsky_star", "⭐")}{" "}
          {renderWorkCard("keret_pig", "🐷")}
        </main>
      </div>
    );
  if (currentScreen === "familyIdentity")
    return (
      <div className="app-container">
        <header
          className="header inner-header"
          style={{
            background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
          }}
        >
          <button className="back-btn" onClick={() => setCurrentScreen("home")}>
            ➔ חזרה
          </button>
          <h1>זהות משפחתית</h1>
          <p>הקשרים והשורשים שלנו</p>
        </header>
        <main className="works-container">
          {renderWorkCard("lord_randall", "🏰", "#f6d365")}{" "}
          {renderWorkCard("rabbis_daughter", "👩‍👧", "#f6d365")}{" "}
          {renderWorkCard("stuart_cherry", "🍒", "#f6d365")}{" "}
          {renderWorkCard("biton_background", "📝", "#f6d365")}{" "}
          {renderWorkCard("black_on_black", "⬛", "#f6d365")}
        </main>
      </div>
    );
  if (currentScreen === "socialIdentity")
    return (
      <div className="app-container">
        <header className="header inner-header social-header">
          <button className="back-btn" onClick={() => setCurrentScreen("home")}>
            ➔ חזרה
          </button>
          <h1>זהות חברתית</h1>
          <p>היחיד מול החברה</p>
        </header>
        <main className="works-container">
          {renderWorkCard("tanai_leave", "📦", "#43e97b")}{" "}
          {renderWorkCard("elmaliah", "📖", "#43e97b")}{" "}
          <div
            className={`work-card ai-card ${
              !unlockedWorks.includes("ai_task") ? "locked-work" : ""
            }`}
            style={{
              position: "relative",
              opacity: unlockedWorks.includes("ai_task") ? 1 : 0.75,
            }}
          >
            {renderAdminToggle("ai_task", false)}
            <div className="work-icon" style={{ marginTop: "25px" }}>
              🤖
            </div>
            <div className="work-info">
              <h3 style={{ color: "#fff" }}>עבודה מסכמת - AI</h3>
            </div>
            {unlockedWorks.includes("ai_task") ? (
              <button
                className="enter-btn ai-enter-btn"
                onClick={() => setCurrentScreen("aiProject")}
              >
                התחל משימה
              </button>
            ) : (
              <button
                className="enter-btn"
                style={{ background: "#a4b0be" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLockedClick("משימת ה-AI נעולה!");
                }}
              >
                🔒 נעול
              </button>
            )}
          </div>
        </main>
      </div>
    );
  if (currentScreen === "nationalIdentity")
    return (
      <div className="app-container">
        <header
          className="header inner-header"
          style={{
            background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
          }}
        >
          <button className="back-btn" onClick={() => setCurrentScreen("home")}>
            ➔ חזרה
          </button>
          <h1>זהות לאומית</h1>
          <p>שורשים ושייכות לעם ולמדינה</p>
        </header>
        <main className="works-container">
          {renderWorkCard("tzetnik_number", "🔢", "#66a6ff")}{" "}
          {renderWorkCard("agnon_enemy", "🤝", "#66a6ff")}{" "}
          {renderWorkCard("shemer_win", "🇮🇱", "#66a6ff")}
        </main>
      </div>
    );

  // מסך הבית
  return (
    <div className="app-container dynamic-bg">
      <header
        className="header"
        style={{ boxShadow: "none", background: "transparent" }}
      >
        <button
          onClick={handleLogout}
          className="logout-btn"
          style={{ background: "rgba(0,0,0,0.1)" }}
        >
          התנתק
        </button>
        <h1 style={{ color: "#2d3436" }}>
          היי {studentName},<br /> איזה יופי שחזרת ללמוד!
        </h1>
        <div
          className="progress-container"
          style={{ background: "rgba(255,255,255,0.6)" }}
        >
          <div className="progress-info" style={{ color: "#2d3436" }}>
            <span>ההתקדמות שלי</span>
            <span>{stars} ⭐️</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min((stars / 500) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </header>

      <section
        className="top-toolbox"
        onClick={() => setCurrentScreen("toolbox")}
      >
        <div className="toolbox-icon">🧰</div>
        <div className="toolbox-text">
          <h2>ארגז הכלים שלי</h2>
          <p>מושגי יסוד, ז'אנרים ואמצעים רטוריים</p>
        </div>
      </section>

      <main className="circles-container">
        <div
          className={`circle-card ${
            unlockedCircles.includes("personal") ? "unlocked" : "locked"
          }`}
          onClick={() =>
            unlockedCircles.includes("personal")
              ? setCurrentScreen("personalIdentity")
              : handleLockedClick()
          }
          style={{ position: "relative" }}
        >
          {renderAdminToggle("personal", true)}
          {!unlockedCircles.includes("personal") && (
            <div className="lock-icon" style={{ marginTop: "25px" }}>
              🔒
            </div>
          )}
          <h2
            style={
              unlockedCircles.includes("personal") ? {} : { marginTop: "25px" }
            }
          >
            זהות אישית
          </h2>
          <p>
            {unlockedCircles.includes("personal")
              ? "לכל איש יש שם ועוד..."
              : "נעול עד לשיעור"}
          </p>
        </div>

        <div
          className={`circle-card ${
            unlockedCircles.includes("family") ? "unlocked" : "locked"
          }`}
          onClick={() =>
            unlockedCircles.includes("family")
              ? setCurrentScreen("familyIdentity")
              : handleLockedClick()
          }
          style={{ position: "relative", borderColor: "#fda085" }}
        >
          {renderAdminToggle("family", true)}
          {!unlockedCircles.includes("family") && (
            <div className="lock-icon" style={{ marginTop: "25px" }}>
              🔒
            </div>
          )}
          <h2
            style={
              unlockedCircles.includes("family")
                ? { color: "#e67e22" }
                : { marginTop: "25px" }
            }
          >
            זהות משפחתית
          </h2>
          <p>
            {unlockedCircles.includes("family")
              ? "לורד רנדל ועוד..."
              : "נעול עד לשיעור"}
          </p>
        </div>

        <div
          className={`circle-card ${
            unlockedCircles.includes("social") ? "unlocked" : "locked"
          }`}
          onClick={() =>
            unlockedCircles.includes("social")
              ? setCurrentScreen("socialIdentity")
              : handleLockedClick()
          }
          style={{ position: "relative" }}
        >
          {renderAdminToggle("social", true)}
          {!unlockedCircles.includes("social") && (
            <div className="lock-icon" style={{ marginTop: "25px" }}>
              🔒
            </div>
          )}
          <h2
            style={
              unlockedCircles.includes("social") ? {} : { marginTop: "25px" }
            }
          >
            זהות חברתית
          </h2>
          <p>
            {unlockedCircles.includes("social")
              ? "אלמליח | AI"
              : "נעול עד לשיעור"}
          </p>
        </div>

        <div
          className={`circle-card ${
            unlockedCircles.includes("national") ? "unlocked" : "locked"
          }`}
          onClick={() =>
            unlockedCircles.includes("national")
              ? setCurrentScreen("nationalIdentity")
              : handleLockedClick()
          }
          style={{ position: "relative" }}
        >
          {renderAdminToggle("national", true)}
          {!unlockedCircles.includes("national") && (
            <div className="lock-icon" style={{ marginTop: "25px" }}>
              🔒
            </div>
          )}
          <h2
            style={
              unlockedCircles.includes("national") ? {} : { marginTop: "25px" }
            }
          >
            זהות לאומית
          </h2>
          <p>
            {unlockedCircles.includes("national")
              ? "לא תנצחו אותי ועוד..."
              : "נעול עד לשיעור"}
          </p>
        </div>
      </main>

      {isAdmin && (
        <div
          style={{
            padding: "15px 20px",
            background: "rgba(255,255,255,0.8)",
            borderTop: "1px solid #dfe4ea",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            style={{
              background: "#2d3436",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "15px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ⚙️ פאנל ניהול שיעורים מורחב
          </button>
        </div>
      )}

      {showAdminPanel && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#fdfbfb",
            zIndex: 999,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ margin: 0, color: "#2d3436" }}>פאנל ניהול יצירות</h2>
            <button
              onClick={() => setShowAdminPanel(false)}
              style={{
                background: "#ff7675",
                color: "white",
                border: "none",
                padding: "8px 15px",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              סגירה
            </button>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            {Object.values(worksDatabase).map((work) => (
              <div
                key={work.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "white",
                  padding: "15px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                }}
              >
                <span style={{ fontWeight: "500" }}>
                  {work.title}{" "}
                  <span style={{ fontSize: "0.8rem", color: "#636e72" }}>
                    ({work.author})
                  </span>
                </span>
                <button
                  onClick={() => toggleWorkUnlock(work.id)}
                  style={{
                    border: "none",
                    background: unlockedWorks.includes(work.id)
                      ? "#d4edda"
                      : "#f8d7da",
                    color: unlockedWorks.includes(work.id)
                      ? "#155724"
                      : "#721c24",
                    padding: "8px 15px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {unlockedWorks.includes(work.id) ? "🔓 פתוח" : "🔒 נעול"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h3>רגע... 🛑</h3>
            <p>{popupMessage}</p>
            <button className="close-btn" onClick={() => setShowPopup(false)}>
              הבנתי!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
