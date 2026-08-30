import React from "react";

// 🤖 מעבדת ה-AI — עבודה מסכמת (בבנייה)
function AiProject({ onBack }) {
  return (
    <div className="app-container ai-container">
      <header className="header inner-header ai-header">
        <button className="back-btn" onClick={onBack}>
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
}

export default AiProject;
