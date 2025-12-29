import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { ADMIN_EMAILS } from "./admin.config";

interface AdminRouteProps {
  children: React.ReactElement;
}

interface AuthState {
  user: { email?: string } | null;
  loading: boolean;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth() as AuthState;

  if (loading) {
    return null;
  }

  if (!user || !ADMIN_EMAILS.includes(user.email ?? "")) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
