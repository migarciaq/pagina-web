// Global `.skip-link` class lives in src/styles/global.css (cross-cutting
// a11y utility, not a per-component CSS Module — see design.md project
// structure comment).
export default function SkipLink({ targetId = 'main-content', children = 'Saltar al contenido principal' }) {
  const handleActivate = (event) => {
    const target = document.getElementById(targetId);
    if (!target) return;
    event.preventDefault();
    target.focus();
  };

  return (
    <a href={`#${targetId}`} className="skip-link" onClick={handleActivate}>
      {children}
    </a>
  );
}
