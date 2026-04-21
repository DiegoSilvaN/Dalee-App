export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = "px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98]",
    outline: "border-2 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white active:scale-[0.98]",
    ghost: "bg-transparent text-[var(--text-2)] hover:bg-[var(--surface)]",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
