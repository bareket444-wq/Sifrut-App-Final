import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { worksDatabase } from "../data/works";

// ⚙️ פאנל הניהול של המורה: מנעולים + צפייה בתשובות התלמידים
function AdminPanel({ unlockedWorks, onToggleWork, onClose }) {
  const [adminTab, setAdminTab] = useState("locks");
  const [submissions, setSubmissions] = useState([]);
  const [selectedWorkFilter, setSelectedWorkFilter] = useState("all");

  // ☁️ האזנה בזמן אמת לכל התשובות שנשלחו
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "submissions"),
      (snap) => {
        const items = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
        // מיון: החדש ביותר למעלה
        items.sort(
          (a, b) =>
            (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)
        );
        setSubmissions(items);
      },
      (err) => console.error("שגיאה בטעינת תשובות:", err)
    );
    return () => unsub();
  }, []);

  const formatTime = (ts) => {
    if (!ts?.seconds) return "";
    return new Date(ts.seconds * 1000).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSubmissions =
    selectedWorkFilter === "all"
      ? submissions
      : submissions.filter((s) => s.workId === selectedWorkFilter);

  const tabBtnStyle = (active) => ({
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
    background: active ? "#2d3436" : "#dfe4ea",
    color: active ? "white" : "#2d3436",
  });

  return (
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
        <h2 style={{ margin: 0, color: "#2d3436" }}>פאנל ניהול</h2>
        <button
          onClick={onClose}
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

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          style={tabBtnStyle(adminTab === "locks")}
          onClick={() => setAdminTab("locks")}
        >
          🔐 מנעולי יצירות
        </button>
        <button
          style={tabBtnStyle(adminTab === "submissions")}
          onClick={() => setAdminTab("submissions")}
        >
          📥 תשובות תלמידים ({submissions.length})
        </button>
      </div>

      {adminTab === "locks" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                onClick={() => onToggleWork(work.id)}
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
      )}

      {adminTab === "submissions" && (
        <div>
          <select
            value={selectedWorkFilter}
            onChange={(e) => setSelectedWorkFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #dfe4ea",
              marginBottom: "15px",
              fontFamily: "inherit",
              fontSize: "0.95rem",
            }}
          >
            <option value="all">כל היצירות</option>
            {Object.values(worksDatabase).map((work) => (
              <option key={work.id} value={work.id}>
                {work.title}
              </option>
            ))}
          </select>

          {filteredSubmissions.length === 0 && (
            <p style={{ textAlign: "center", color: "#636e72" }}>
              עדיין לא נשלחו תשובות 📭
            </p>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {filteredSubmissions.map((sub) => {
              const work = worksDatabase[sub.workId];
              return (
                <div
                  key={sub.docId}
                  style={{
                    background: "white",
                    padding: "15px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: "8px",
                    }}
                  >
                    <strong style={{ color: "#2d3436" }}>
                      🧑‍🎓 {sub.studentName}
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "#636e72" }}>
                      {formatTime(sub.updatedAt || sub.submittedAt)}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      fontSize: "0.85rem",
                      color: "#a18cd1",
                      fontWeight: "bold",
                    }}
                  >
                    {sub.workTitle || sub.workId}
                  </p>
                  {(sub.answers || []).map((answer, i) => (
                    <div key={i} style={{ marginBottom: "10px" }}>
                      <p
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "0.8rem",
                          color: "#636e72",
                        }}
                      >
                        {i + 1}. {work?.questions?.[i] || ""}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          background: "#f8f9fa",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          whiteSpace: "pre-wrap",
                          fontSize: "0.9rem",
                        }}
                      >
                        {answer.trim() === "" ? "— לא נענה —" : answer}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
