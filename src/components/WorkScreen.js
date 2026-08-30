import React, { useState, useEffect, useCallback, useRef } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, studentDocId } from "../firebase";

// 📖 מסך יצירה — סיכום, מצגת ושאלות עומק (כולל שמירת תשובות בענן!)
function WorkScreen({ workData, studentName, onBack, onAwardStars }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // ✍️ התשובות של התלמיד/ה
  const [answers, setAnswers] = useState(() =>
    workData.questions.map(() => "")
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const hasTypedRef = useRef(false); // כדי לא לדרוס טקסט שהתלמיד/ה כבר התחיל/ה להקליד

  const submissionRef = useCallback(
    () =>
      doc(db, "submissions", `${studentDocId(studentName)}__${workData.id}`),
    [studentName, workData.id]
  );

  // ☁️ בכניסה ליצירה — טוענים תשובות שכבר נשלחו בעבר (אם יש)
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const snap = await getDoc(submissionRef());
        if (!cancelled && snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data.answers) && !hasTypedRef.current) {
            setAnswers(
              workData.questions.map((_, i) => data.answers[i] || "")
            );
          }
          setHasSubmitted(true);
        }
      } catch (err) {
        console.error("שגיאה בטעינת תשובות:", err);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [submissionRef, workData.questions]);

  const handleAnswerChange = (index, value) => {
    hasTypedRef.current = true;
    setAnswers((prev) => prev.map((a, i) => (i === index ? value : a)));
  };

  // 📨 שליחת התשובות לענן
  const handleSubmit = async () => {
    if (answers.every((a) => a.trim() === "")) {
      setSaveMessage("כתבו לפחות תשובה אחת לפני השליחה 🙂");
      return;
    }
    setIsSaving(true);
    setSaveMessage("");
    try {
      // ⭐ בדיקה מול הענן ברגע השליחה — מונע כוכבים כפולים על אותה יצירה
      const existing = await getDoc(submissionRef());
      const isFirstSubmission = !existing.exists();
      await setDoc(
        submissionRef(),
        {
          studentName: studentName,
          workId: workData.id,
          workTitle: workData.title,
          answers: answers,
          updatedAt: serverTimestamp(),
          ...(isFirstSubmission ? { submittedAt: serverTimestamp() } : {}),
        },
        { merge: true }
      );
      setHasSubmitted(true);
      if (isFirstSubmission) {
        onAwardStars(100); // ⭐ כוכבים רק על שליחה ראשונה של כל יצירה
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      } else {
        setSaveMessage("התשובות עודכנו בהצלחה! ✔️");
      }
    } catch (err) {
      console.error("שגיאה בשמירת תשובות:", err);
      setSaveMessage("אופס, השמירה נכשלה. בדקו את החיבור לאינטרנט ונסו שוב.");
    } finally {
      setIsSaving(false);
    }
  };

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
        <button className="back-btn" onClick={onBack}>
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
          className={`tab-btn ${activeTab === "presentation" ? "active" : ""}`}
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
          <div className="content-card fade-in" style={{ textAlign: "right" }}>
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
                        שקף {currentSlideIndex + 1} מתוך {workData.slides.length}
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
                    disabled={currentSlideIndex === workData.slides.length - 1}
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
            {hasSubmitted && (
              <p
                style={{
                  background: "#e8f8f5",
                  color: "#27ae60",
                  padding: "10px 15px",
                  borderRadius: "10px",
                  fontSize: "0.9rem",
                }}
              >
                ✔️ התשובות שלך נשמרו אצל המורה. אפשר לערוך ולשלוח שוב.
              </p>
            )}
            {workData.questions.map((question, index) => (
              <div key={index} className="question-item">
                <p>
                  <strong>{index + 1}.</strong> {question}
                </p>
                <textarea
                  className="answer-input"
                  placeholder="הקלידו את התשובה כאן..."
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            ))}
            {saveMessage && (
              <p
                style={{
                  textAlign: "center",
                  color: "#636e72",
                  fontWeight: "500",
                }}
              >
                {saveMessage}
              </p>
            )}
            <button
              className="action-btn"
              style={{ width: "100%", marginTop: "15px" }}
              disabled={isSaving}
              onClick={handleSubmit}
            >
              {isSaving
                ? "שולח..."
                : hasSubmitted
                ? "עדכון תשובות ✔️"
                : "שלח לבדיקה ✔️ (+100 ⭐️)"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default WorkScreen;
