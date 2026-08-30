import React from "react";

// 🛑 חלונית הודעה (למשל כשמנסים להיכנס לתוכן נעול)
function Popup({ message, onClose }) {
  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>רגע... 🛑</h3>
        <p>{message}</p>
        <button className="close-btn" onClick={onClose}>
          הבנתי!
        </button>
      </div>
    </div>
  );
}

export default Popup;
