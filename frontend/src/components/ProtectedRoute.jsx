import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({
  children,
  redirectTo = "/login",
}) {
  const location = useLocation();

  const token =
    localStorage.getItem(
      "student_token"
    );

  if (!token) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
