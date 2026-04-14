export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`html, body { background: var(--charcoal) !important; }`}</style>
      {children}
    </>
  );
}
