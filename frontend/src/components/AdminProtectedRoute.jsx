import React from "react";
import {
  Navigate,
  useLocation,
} from "react-router-dom";

function AdminProtectedRoute({
  children,
}) {
  const location = useLocation();

  const adminToken =
    localStorage.getItem(
      "admin_token"
    );

  if (!adminToken) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

export default AdminProtectedRoute;
