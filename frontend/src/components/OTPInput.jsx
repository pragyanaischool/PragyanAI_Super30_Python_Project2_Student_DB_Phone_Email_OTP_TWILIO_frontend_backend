import React, {
  useEffect,
  useRef,
} from "react";

function OTPInput({
  value = "",
  onChange,
  length = 6,
  disabled = false,
  autoFocus = true,
}) {
  const inputRefs =
    useRef([]);

  const digits = Array.from(
    { length },
    (_, index) =>
      value?.[index] || ""
  );

  useEffect(() => {
    if (
      autoFocus &&
      !disabled &&
      inputRefs.current[0]
    ) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const updateValue = (
    index,
    newDigit
  ) => {
    const cleanDigit =
      newDigit
        .replace(/\D/g, "")
        .slice(-1);

    const currentDigits =
      Array.from(
        { length },
        (_, i) =>
          value?.[i] || ""
      );

    currentDigits[index] =
      cleanDigit;

    const newValue =
      currentDigits.join("");

    if (onChange) {
      onChange(newValue);
    }

    if (
      cleanDigit &&
      index < length - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    event,
    index
  ) => {
    if (
      event.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputRefs.current[
        index - 1
      ]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < length - 1
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const handlePaste = (
    event
  ) => {
    event.preventDefault();

    const pastedText =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);

    if (!pastedText) {
      return;
    }

    if (onChange) {
      onChange(pastedText);
    }

    const focusIndex = Math.min(
      pastedText.length,
      length - 1
    );

    inputRefs.current[
      focusIndex
    ]?.focus();
  };

  return (
    <div
      className="otp-input-container"
      role="group"
      aria-label="One-time password"
    >
      {Array.from(
        { length },
        (_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[
                index
              ] = element;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={
              digits[index]
            }
            disabled={disabled}
            autoComplete={
              index === 0
                ? "one-time-code"
                : "off"
            }
            aria-label={`OTP digit ${
              index + 1
            }`}
            className="otp-input"
            onChange={(event) =>
              updateValue(
                index,
                event.target.value
              )
            }
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                index
              )
            }
            onPaste={handlePaste}
          />
        )
      )}
    </div>
  );
}

export default OTPInput;
