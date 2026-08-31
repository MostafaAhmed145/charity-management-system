export function LogoLockup({
  size = 36,
  showWord = false,
  word = "جمعية الهداية",
  onDark = false,
  wordClassName = "",
  variant = "bar",
}) {
  const isHero = variant === "hero";
  const tone = wordClassName
    ? wordClassName
    : onDark
      ? "text-[#F4F4F2]"
      : "text-[#1C211E]";

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`inline-flex shrink-0 overflow-hidden rounded-full ${
          onDark ? "ring-2 ring-[#F4F4F2]" : ""
        }`}
        style={{ width: size, height: size }}
      >
        <img
          src="/logo-mark.png"
          alt=""
          width={size}
          height={size}
          className="block h-full w-full origin-center scale-[1.12] object-cover"
        />
      </span>
      {showWord && (
        <span
          className={`font-heading font-bold leading-normal ${tone} ${
            isHero ? "text-[1.75rem]" : "text-[1.25rem]"
          }`}
        >
          {word}
        </span>
      )}
    </span>
  );
}
