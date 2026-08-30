import React from "react";

// 🧰 ארגז הכלים — מושגי יסוד ואמצעים רטוריים
function Toolbox({ onBack }) {
  return (
    <div className="app-container">
      <header className="header inner-header toolbox-header">
        <button className="back-btn" onClick={onBack}>
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
}

export default Toolbox;
