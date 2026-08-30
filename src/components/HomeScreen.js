import React from "react";
import { circles } from "../data/works";
import AdminToggle from "./AdminToggle";

// 🏠 מסך הבית — ברכת שלום, התקדמות ומעגלי הזהות
function HomeScreen({
  studentName,
  stars,
  isAdmin,
  unlockedCircles,
  onToggleCircle,
  onOpenCircle,
  onLockedClick,
  onOpenToolbox,
  onOpenAdminPanel,
  onLogout,
  children,
}) {
  return (
    <div className="app-container dynamic-bg">
      <header
        className="header"
        style={{ boxShadow: "none", background: "transparent" }}
      >
        <button
          onClick={onLogout}
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

      <section className="top-toolbox" onClick={onOpenToolbox}>
        <div className="toolbox-icon">🧰</div>
        <div className="toolbox-text">
          <h2>ארגז הכלים שלי</h2>
          <p>מושגי יסוד, ז'אנרים ואמצעים רטוריים</p>
        </div>
      </section>

      <main className="circles-container">
        {circles.map((circle) => {
          const isUnlocked = unlockedCircles.includes(circle.key);
          return (
            <div
              key={circle.key}
              className={`circle-card ${isUnlocked ? "unlocked" : "locked"}`}
              onClick={() =>
                isUnlocked ? onOpenCircle(circle.screen) : onLockedClick()
              }
              style={{
                position: "relative",
                ...(circle.cardBorderColor
                  ? { borderColor: circle.cardBorderColor }
                  : {}),
              }}
            >
              <AdminToggle
                isAdmin={isAdmin}
                isUnlocked={isUnlocked}
                onToggle={() => onToggleCircle(circle.key)}
              />
              {!isUnlocked && (
                <div className="lock-icon" style={{ marginTop: "25px" }}>
                  🔒
                </div>
              )}
              <h2
                style={
                  isUnlocked
                    ? circle.titleColor
                      ? { color: circle.titleColor }
                      : {}
                    : { marginTop: "25px" }
                }
              >
                {circle.title}
              </h2>
              <p>{isUnlocked ? circle.homeSubtitle : "נעול עד לשיעור"}</p>
            </div>
          );
        })}
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
            onClick={onOpenAdminPanel}
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

      {children}
    </div>
  );
}

export default HomeScreen;
