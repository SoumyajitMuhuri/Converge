export default function Button({ children, title, value, type = "button", className = "", disabled = false, onClick, open = false }) {
  return (
    <button type={type} className={className} disabled={disabled} onClick={onClick}>{children}</button>
  );
}
