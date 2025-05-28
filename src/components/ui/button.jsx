export function Button({ children, onClick, className = "", type = "button", variant = "default", size = "md" }) {
  const base =
    "inline-flex items-center justify-center font-medium rounded-2xl px-4 py-2 shadow-sm transition";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
  };
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
