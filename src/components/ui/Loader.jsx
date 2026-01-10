export function Loader({ label }) {
    return (<div style={{
            padding: 32,
            textAlign: "center",
            opacity: 0.6,
        }}>
      {label ?? "Loading…"}
    </div>);
}
