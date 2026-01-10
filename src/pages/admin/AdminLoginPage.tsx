import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";

export function AdminLoginPage() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div>
      <h1>Admin login</h1>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}
