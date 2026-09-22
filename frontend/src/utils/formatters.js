/* =========================================================
   PRAGYANAI STUDENT VERIFICATION PLATFORM
   FORMATTER UTILITIES
   ========================================================= */

import {
  APPROVAL_STATUS,
} from "./constants";

/*
|--------------------------------------------------------------------------
| TEXT
|--------------------------------------------------------------------------
*/

export function capitalize(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const text =
    String(value).trim();

  if (!text) {
    return "";
  }

  return (
    text.charAt(0).toUpperCase() +
    text.slice(1).toLowerCase()
  );
}

/*
|--------------------------------------------------------------------------
| TITLE CASE
|--------------------------------------------------------------------------
*/

export function titleCase(
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

/*
|--------------------------------------------------------------------------
| NAME
|--------------------------------------------------------------------------
*/

export function formatStudentName(
  name
) {
  if (!name) {
    return "Student";
  }

  return titleCase(name);
}

/*
|--------------------------------------------------------------------------
| EMAIL
|--------------------------------------------------------------------------
*/

export function formatEmail(
  email
) {
  if (!email) {
    return "-";
  }

  return String(email)
    .trim()
    .toLowerCase();
}

/*
|--------------------------------------------------------------------------
| MASK EMAIL
|--------------------------------------------------------------------------
*/

export function maskEmail(
  email
) {
  if (!email) {
    return "";
  }

  const normalized =
    String(email)
      .trim()
      .toLowerCase();

  const parts =
    normalized.split("@");

  if (parts.length !== 2) {
    return normalized;
  }

  const username =
    parts[0];

  const domain =
    parts[1];

  if (username.length <= 2) {
    return `**@${domain}`;
  }

  return (
    username.charAt(0) +
    "*".repeat(
      Math.max(
        username.length - 2,
        1
      )
    ) +
    username.charAt(
      username.length - 1
    ) +
    `@${domain}`
  );
}

/*
|--------------------------------------------------------------------------
| PHONE
|--------------------------------------------------------------------------
*/

export function formatPhone(
  phone
) {
  if (!phone) {
    return "-";
  }

  return String(phone).trim();
}

/*
|--------------------------------------------------------------------------
| MASK PHONE
|--------------------------------------------------------------------------
*/

export function maskPhone(
  phone
) {
  if (!phone) {
    return "";
  }

  const value =
    String(phone)
      .trim();

  const digits =
    value.replace(
      /\D/g,
      ""
    );

  if (digits.length < 4) {
    return "****";
  }

  return (
    "*".repeat(
      Math.max(
        digits.length - 4,
        0
      )
    ) +
    digits.slice(-4)
  );
}

/*
|--------------------------------------------------------------------------
| CGPA
|--------------------------------------------------------------------------
*/

export function formatCGPA(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const numeric =
    Number(value);

  if (
    !Number.isFinite(
      numeric
    )
  ) {
    return "-";
  }

  return numeric.toFixed(2);
}

/*
|--------------------------------------------------------------------------
| PERCENTAGE
|--------------------------------------------------------------------------
*/

export function formatPercentage(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const numeric =
    Number(value);

  if (
    !Number.isFinite(
      numeric
    )
  ) {
    return "-";
  }

  return `${numeric.toFixed(1)}%`;
}

/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

export function formatDate(
  value,
  options = {}
) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  const defaultOptions = {
    day:
      "2-digit",

    month:
      "short",

    year:
      "numeric",
  };

  return date.toLocaleDateString(
    "en-IN",
    {
      ...defaultOptions,
      ...options,
    }
  );
}

/*
|--------------------------------------------------------------------------
| DATE + TIME
|--------------------------------------------------------------------------
*/

export function formatDateTime(
  value
) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  return date.toLocaleString(
    "en-IN",
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",
    }
  );
}

/*
|--------------------------------------------------------------------------
| RELATIVE DATE
|--------------------------------------------------------------------------
*/

export function formatRelativeDate(
  value
) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "-";
  }

  const now =
    new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const seconds =
    Math.floor(
      difference / 1000
    );

  if (seconds < 60) {
    return "Just now";
  }

  const minutes =
    Math.floor(
      seconds / 60
    );

  if (minutes < 60) {
    return `${minutes} minute${
      minutes === 1
        ? ""
        : "s"
    } ago`;
  }

  const hours =
    Math.floor(
      minutes / 60
    );

  if (hours < 24) {
    return `${hours} hour${
      hours === 1
        ? ""
        : "s"
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24
    );

  if (days < 30) {
    return `${days} day${
      days === 1
        ? ""
        : "s"
    } ago`;
  }

  return formatDate(value);
}

/*
|--------------------------------------------------------------------------
| APPROVAL STATUS
|--------------------------------------------------------------------------
*/

export function formatApprovalStatus(
  status
) {
  if (!status) {
    return "Pending";
  }

  const normalized =
    String(status)
      .trim()
      .toUpperCase();

  switch (normalized) {
    case APPROVAL_STATUS.APPROVED:
      return "Approved";

    case APPROVAL_STATUS.REJECTED:
      return "Rejected";

    case APPROVAL_STATUS.PENDING:
      return "Pending";

    default:
      return titleCase(
        normalized
      );
  }
}

/*
|--------------------------------------------------------------------------
| VERIFICATION STATUS
|--------------------------------------------------------------------------
*/

export function formatVerificationStatus(
  verified
) {
  return verified
    ? "Verified"
    : "Not Verified";
}

/*
|--------------------------------------------------------------------------
| BOOLEAN STATUS
|--------------------------------------------------------------------------
*/

export function formatBoolean(
  value
) {
  return value
    ? "Yes"
    : "No";
}

/*
|--------------------------------------------------------------------------
| STUDENT ID
|--------------------------------------------------------------------------
*/

export function formatStudentId(
  id
) {
  if (
    id === null ||
    id === undefined ||
    id === ""
  ) {
    return "-";
  }

  return `#${id}`;
}

/*
|--------------------------------------------------------------------------
| DEGREE / BRANCH
|--------------------------------------------------------------------------
*/

export function formatDegree(
  degree
) {
  if (!degree) {
    return "-";
  }

  return String(degree).trim();
}

export function formatBranch(
  branch
) {
  if (!branch) {
    return "-";
  }

  return String(branch).trim();
}

/*
|--------------------------------------------------------------------------
| COLLEGE
|--------------------------------------------------------------------------
*/

export function formatCollegeName(
  college
) {
  if (!college) {
    return "-";
  }

  return String(college).trim();
}

/*
|--------------------------------------------------------------------------
| TRUNCATE TEXT
|--------------------------------------------------------------------------
*/

export function truncateText(
  value,
  maxLength = 50
) {
  if (!value) {
    return "";
  }

  const text =
    String(value);

  if (
    text.length <=
    maxLength
  ) {
    return text;
  }

  return (
    text.slice(
      0,
      maxLength - 3
    ) +
    "..."
  );
}

/*
|--------------------------------------------------------------------------
| API ERROR MESSAGE
|--------------------------------------------------------------------------
*/

export function formatApiError(
  error,
  fallback =
    "Something went wrong. Please try again."
) {
  if (!error) {
    return fallback;
  }

  /*
   * FastAPI validation errors.
   */
  if (
    Array.isArray(
      error.response?.data?.detail
    )
  ) {
    return error.response.data.detail
      .map((item) => {
        if (
          typeof item ===
          "string"
        ) {
          return item;
        }

        return (
          item?.msg ||
          "Invalid request."
        );
      })
      .join(" ");
  }

  /*
   * FastAPI HTTPException.
   */
  if (
    typeof error.response?.data?.detail ===
    "string"
  ) {
    return error.response.data.detail;
  }

  /*
   * Backend message.
   */
  if (
    typeof error.response?.data?.message ===
    "string"
  ) {
    return error.response.data.message;
  }

  /*
   * Network error.
   */
  if (
    !error.response &&
    error.message
  ) {
    return error.message;
  }

  return fallback;
}

/*
|--------------------------------------------------------------------------
| NUMBER
|--------------------------------------------------------------------------
*/

export function formatNumber(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "0";
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "0";
  }

  return number.toLocaleString(
    "en-IN"
  );
}

/*
|--------------------------------------------------------------------------
| CURRENCY
|--------------------------------------------------------------------------
*/

export function formatINR(
  value
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "₹0";
  }

  const number =
    Number(value);

  if (
    !Number.isFinite(
      number
    )
  ) {
    return "₹0";
  }

  return number.toLocaleString(
    "en-IN",
    {
      style:
        "currency",

      currency:
        "INR",

      maximumFractionDigits:
        0,
    }
  );
}
