export function PageHeading({ children, className = "" }) {
  return (
    <h1
      className={`font-ruqaa text-[1.625rem] font-bold tracking-[-0.04em] text-[#1C211E] ${className}`}
    >
      {children}
    </h1>
  );
}
