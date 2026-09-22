import React from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

function StudentProtectedRoute({
  children,
}) {
  const location = useLocation();

  const studentToken =
    localStorage.getItem(
      "student_token"
    );

  if (!studentToken) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default StudentProtectedRoute;
