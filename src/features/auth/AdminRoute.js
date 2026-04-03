import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { ADMIN_EMAILS } from "./admin.config";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
export function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return null;
    }
    if (!user) {
        return <Navigate to="/admin/login" replace/>;
    }
    if (!ADMIN_EMAILS.includes(user.email ?? "")) {
        alert("You do not have access to the admin panel.");
        signOut(auth);
        return <Navigate to="/admin/login" replace/>;
    }
    return children;
}
