// src/pages/ProtectedLayout.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Headerbar from "./features/headerbar/Headerbar";

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* header, sidebar, nav go here */}
      <Headerbar />
      <Outlet />
    </div>
  );
};

export default ProtectedLayout;
