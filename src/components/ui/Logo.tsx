export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? "h-7" : size === "lg" ? "h-11" : "h-9";
  return (
    <a href="/" className={`flex items-center ${h} group cursor-pointer`}>
      <img src="/logo.svg" alt="Hospeda Bem" className="h-full w-auto" />
    </a>
  );
}
