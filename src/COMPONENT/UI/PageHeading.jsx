export function PageHeading({ children, className = "" }) {
  return (
    <h1
      className={`font-heading text-[1.625rem] font-bold leading-normal text-[#1C211E] ${className}`}
    >
      {children}
    </h1>
  );
}
