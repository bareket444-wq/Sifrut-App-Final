import React from "react";

// 🔹 כפתור נעילה/פתיחה שמופיע רק למורה, על כרטיסי מעגלים ויצירות
function AdminToggle({ isAdmin, isUnlocked, onToggle }) {
  if (!isAdmin) return null; // 🛑 תלמידים לא יראו את הכפתור הזה

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
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
}

export default AdminToggle;
