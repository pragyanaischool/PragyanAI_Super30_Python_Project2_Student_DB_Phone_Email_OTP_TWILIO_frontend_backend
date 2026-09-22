import React from "react";

function StatusBadge({
  status,
}) {
  const normalizedStatus =
    String(
      status || "PENDING"
    )
      .trim()
      .toUpperCase();

  let className =
    "status-badge status-pending";

  let label =
    normalizedStatus;

  switch (
    normalizedStatus
  ) {
    case "APPROVED":
      className =
        "status-badge status-approved";
      label = "Approved";
      break;

    case "REJECTED":
      className =
        "status-badge status-rejected";
      label = "Rejected";
      break;

    case "PENDING":
      className =
        "status-badge status-pending";
      label = "Pending";
      break;

    case "VERIFIED":
      className =
        "status-badge status-verified";
      label = "Verified";
      break;

    case "UNVERIFIED":
      className =
        "status-badge status-unverified";
      label = "Unverified";
      break;

    default:
      className =
        "status-badge status-pending";

      label =
        normalizedStatus || "Pending";
  }

  return (
    <span
      className={className}
      aria-label={`Status: ${label}`}
    >
      <span className="status-dot" />
      {label}
    </span>
  );
}

export default StatusBadge;
