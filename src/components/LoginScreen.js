import React, { useState } from "react";

// 🚪 מסך ההתחברות
function LoginScreen({ onLogin }) {
  const [inputName, setInputName] = useState("");

  const handleAuth = (e) => {
    e.preventDefault();
    if (inputName.trim() !== "") {
      onLogin(inputName.trim());
    }
  };

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
        <p style={{ fontSize: "0.8rem", color: "#636e72", marginTop: "15px" }}>
          * מורה? הקלידי "ברקת" כדי לקבל הרשאות ניהול.
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
