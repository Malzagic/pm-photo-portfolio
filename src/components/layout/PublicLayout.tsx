import { Outlet } from "react-router-dom";

export function PublicLayout() {
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <nav style={{ display: "flex", gap: 16 }}>
          <a href="/">Home</a>
          <a href="/portfolio">Portfolio</a>
        </nav>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </>
  );
}
