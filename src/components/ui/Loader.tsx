export function Loader({ label }: { label?: string }) {
  return (
    <div
      style={{
        padding: 32,
        textAlign: "center",
        opacity: 0.6,
      }}
    >
      {label ?? "Loading…"}
    </div>
  );
}
