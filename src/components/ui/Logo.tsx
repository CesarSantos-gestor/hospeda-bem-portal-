export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? "h-7" : size === "lg" ? "h-11" : "h-9";
  const fs = size === "sm" ? "1.1rem" : size === "lg" ? "1.6rem" : "1.35rem";
  return (
    <div className={`flex items-center gap-2.5 ${h}`}>
      <svg viewBox="0 0 777 777" className="h-full w-auto" fill="none">
        <path fill="#003580" fillRule="nonzero"
          d="M0 777l0 -777 124 0 0 280c0,0 93,-124 264,-124 171,0 264,124 264,124l0 -280 124 0 0 777 -124 0 0 -326c0,-124 -93,-186 -264,-186 -171,0 -264,62 -264,186l0 326 -124 0z"/>
        <circle cx="388" cy="93" r="43" fill="#FBBF23"/>
      </svg>
      <span className="font-black leading-none" style={{ fontFamily: "Manrope, sans-serif", fontSize: fs }}>
        <span style={{ color: "#003580" }}>hospeda</span><span style={{ color: "#FBBF23" }}>bem</span>
      </span>
    </div>
  );
}
