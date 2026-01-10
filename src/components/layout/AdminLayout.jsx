// src/components/layout/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
export function AdminLayout() {
    return (<div style={{
            minHeight: "100vh",
            background: "#333",
            color: "#fff",
        }}>
      <header style={{
            padding: "16px 24px",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#222",
        }}>
        <strong>Admin Panel</strong>
        <button onClick={() => signOut(auth)}>Logout</button>
      </header>

      <main style={{
            padding: "24px",
            maxWidth: 1200,
            margin: "0 auto",
        }}>
        <Outlet />
      </main>
    </div>);
}
