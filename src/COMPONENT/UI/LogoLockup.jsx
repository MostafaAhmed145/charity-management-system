export function LogoLockup({
  size = 36,
  showWord = false,
  word = "جمعية الهداية",
  onDark = false,
}) {
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src="/logo-mark.png"
        alt="جمعية الهداية"
        width={size}
        height={size}
        className="shrink-0"
      />
      {showWord && (
        <span
          className={`font-ruqaa text-lg font-bold tracking-[-0.04em] ${
            onDark ? "text-[#F4F4F2]" : "text-[#1C211E]"
          }`}
        >
          {word}
        </span>
      )}
    </span>
  );
}
