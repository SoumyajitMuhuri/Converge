export default function Modal({ children, title, value, type = "button", className = "", disabled = false, onClick, open = false }) {
  return (
    open ? <div role="dialog" aria-modal="true" aria-label={title}><h2>{title}</h2>{children}</div> : null
  );
}
