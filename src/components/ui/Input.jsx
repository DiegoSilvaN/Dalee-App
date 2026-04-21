export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-xs font-bold text-[var(--text-2)] uppercase">
          {label}
        </label>
      )}
      <input
        className="w-full p-3 bg-[var(--surface)] text-[var(--text-1)] placeholder:text-[var(--text-2)] border border-[var(--border)] rounded-xl outline-none focus:border-[var(--primary)] transition-colors"
        {...props}
      />
    </div>
  );
}
