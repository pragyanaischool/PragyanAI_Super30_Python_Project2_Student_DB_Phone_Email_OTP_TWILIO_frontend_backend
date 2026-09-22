import React from "react";

function SuccessMessage({
  message,
  title = "Success",
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="message-box success-message"
      role="status"
    >
      <div className="message-icon">
        ✓
      </div>

      <div className="message-content">
        <strong>{title}</strong>

        <p>{message}</p>
      </div>

      {onClose && (
        <button
          type="button"
          className="message-close"
          onClick={onClose}
          aria-label="Close success message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SuccessMessage;
