import { Outlet, NavLink } from "react-router-dom";
/**
 * PublicLayout component.
 * Provides a minimalist header for visitors.
 * Uses NavLink for active state management.
 */
export function PublicLayout() {
    const navLinkStyle = ({ isActive }) => ({
        textDecoration: "none",
        color: isActive ? "var(--text)" : "rgba(255,255,255,0.5)",
        fontSize: "0.9rem",
        transition: "color 0.2s ease",
    });
    return (<>
      <header style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            background: "var(--bg)",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}>
        <div style={{ fontWeight: 600, letterSpacing: "1px" }}>PM PHOTO</div>

        <nav style={{ display: "flex", gap: 24 }}>
          <NavLink to="/" style={navLinkStyle}>
            Home
          </NavLink>
          <NavLink to="/portfolio" style={navLinkStyle}>
            Portfolio
          </NavLink>
          <NavLink to="/about" style={navLinkStyle}>
            About
          </NavLink>
          <NavLink to="/contact" style={navLinkStyle}>
            Contact
          </NavLink>
        </nav>
      </header>

      <main className="container" style={{ paddingTop: "2rem" }}>
        <Outlet />
      </main>
    </>);
}
