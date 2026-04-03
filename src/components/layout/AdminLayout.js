import { Outlet, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
/**
 * AdminLayout component.
 * Enhanced with a professional admin navigation bar.
 */
export function AdminLayout() {
    const adminNavLinkStyle = ({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
        padding: "8px 12px",
        borderRadius: "4px",
        background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
        fontSize: "0.85rem",
        fontWeight: 500,
    });
    return (<div style={{ minHeight: "100vh", background: "#121212", color: "#fff" }}>
      <header style={{
            padding: "12px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#1a1a1a",
            position: "sticky",
            top: 0,
            zIndex: 20,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <strong style={{ letterSpacing: "1px", fontSize: "0.9rem" }}>ADMIN PANEL</strong>
          <nav style={{ display: "flex", gap: 8 }}>
            <NavLink to="/admin" end style={adminNavLinkStyle}>
              Photos
            </NavLink>
            <NavLink to="/admin/categories" style={adminNavLinkStyle}>
              Categories
            </NavLink>
            <NavLink to="/" style={{ ...adminNavLinkStyle({ isActive: false }), color: "#aaa" }}>
              View Site ↗
            </NavLink>
          </nav>
        </div>

        <button onClick={() => signOut(auth)} style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
        }}>
          Logout
        </button>
      </header>

      <main style={{ padding: "40px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <Outlet />
      </main>
    </div>);
}
