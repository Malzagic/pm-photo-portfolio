import { useEffect } from "react";
import { useAuth } from "@/features/auth/useAuth";

export function AdminLoginPage() {
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      window.location.href = "/admin";
    }
  }, [user]);

  if (loading) {
    return null;
  }

  if (user) {
    return null;
  }

  return (
    <div>
      <h1>Admin login</h1>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}
