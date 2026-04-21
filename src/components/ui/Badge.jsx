export default function Badge({ text, type = 'default' }) {
  const types = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    default: "bg-primary-light text-primary"
  };
  return <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${types[type]}`}>{text}</span>;
}