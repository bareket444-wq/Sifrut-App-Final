import React from "react";
import { worksDatabase } from "../data/works";
import AdminToggle from "./AdminToggle";

// 🎡 מסך מעגל זהות — מציג את כרטיסי היצירות של המעגל
function CircleScreen({
  circle,
  isAdmin,
  unlockedWorks,
  onToggleWork,
  onOpenWork,
  onLockedClick,
  onBack,
  onOpenAiProject,
  children,
}) {
  const renderWorkCard = ({ id: workId, icon }) => {
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
        <AdminToggle
          isAdmin={isAdmin}
          isUnlocked={isUnlocked}
          onToggle={() => onToggleWork(workId)}
        />
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
            style={circle.accent ? { background: circle.accent } : {}}
            onClick={() => onOpenWork(workId)}
          >
            כניסה
          </button>
        ) : (
          <button
            className="enter-btn"
            style={{ background: "#a4b0be" }}
            onClick={(e) => {
              e.stopPropagation();
              onLockedClick(
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

  const aiUnlocked = unlockedWorks.includes("ai_task");

  return (
    <div className="app-container">
      <header
        className={`header inner-header ${circle.headerClass || ""}`}
        style={circle.gradient ? { background: circle.gradient } : {}}
      >
        <button className="back-btn" onClick={onBack}>
          ➔ חזרה
        </button>
        <h1>{circle.title}</h1>
        <p>{circle.headerSubtitle}</p>
      </header>
      <main className="works-container">
        {circle.works.map(renderWorkCard)}
        {circle.hasAiCard && (
          <div
            className={`work-card ai-card ${!aiUnlocked ? "locked-work" : ""}`}
            style={{ position: "relative", opacity: aiUnlocked ? 1 : 0.75 }}
          >
            <AdminToggle
              isAdmin={isAdmin}
              isUnlocked={aiUnlocked}
              onToggle={() => onToggleWork("ai_task")}
            />
            <div className="work-icon" style={{ marginTop: "25px" }}>
              🤖
            </div>
            <div className="work-info">
              <h3 style={{ color: "#fff" }}>עבודה מסכמת - AI</h3>
            </div>
            {aiUnlocked ? (
              <button className="enter-btn ai-enter-btn" onClick={onOpenAiProject}>
                התחל משימה
              </button>
            ) : (
              <button
                className="enter-btn"
                style={{ background: "#a4b0be" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onLockedClick("משימת ה-AI נעולה!");
                }}
              >
                🔒 נעול
              </button>
            )}
          </div>
        )}
      </main>
      {children}
    </div>
  );
}

export default CircleScreen;
