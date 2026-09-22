import React, {
  useEffect,
} from "react";

function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
  loading = false,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (
      event
    ) => {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onCancel?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    /*
     * Prevent background scrolling
     * while dialog is open.
     */
    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [
    isOpen,
    loading,
    onCancel,
  ]);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (
    event
  ) => {
    if (
      event.target ===
        event.currentTarget &&
      !loading
    ) {
      onCancel?.();
    }
  };

  return (
    <div
      className="dialog-overlay"
      role="presentation"
      onMouseDown={
        handleBackdropClick
      }
    >
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
      >

        {/* Icon */}
        <div
          className={
            danger
              ? "dialog-icon dialog-icon-danger"
              : "dialog-icon"
          }
        >
          {danger ? "!" : "?"}
        </div>

        {/* Content */}
        <div className="dialog-content">

          <h2 id="confirm-dialog-title">
            {title}
          </h2>

          <p id="confirm-dialog-message">
            {message}
          </p>

        </div>

        {/* Actions */}
        <div className="dialog-actions">

          <button
            type="button"
            className="dialog-button dialog-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={
              danger
                ? "dialog-button dialog-confirm dialog-confirm-danger"
                : "dialog-button dialog-confirm"
            }
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : confirmText}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ConfirmDialog;
