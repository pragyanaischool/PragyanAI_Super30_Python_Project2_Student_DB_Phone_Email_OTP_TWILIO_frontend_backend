import React from "react";

function LoadingSpinner({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
}) {
  const className = [
    "loading-container",
    `loading-${size}`,
    fullScreen
      ? "loading-fullscreen"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
    >
      <div className="loading-spinner">
        <span />
        <span />
        <span />
      </div>

      {text && (
        <p className="loading-text">
          {text}
        </p>
      )}
    </div>
  );
}

export default LoadingSpinner;
