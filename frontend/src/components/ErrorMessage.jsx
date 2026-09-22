import React from "react";

function ErrorMessage({
  message,
  title = "Something went wrong",
  onClose,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="message-box error-message"
      role="alert"
    >
      <div className="message-icon">
        !
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
          aria-label="Close error message"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
