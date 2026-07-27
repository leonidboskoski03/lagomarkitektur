const letters = ["L", "A", "G", "O", "M"] as const;

export function FooterWordmark() {
  return (
    <div
      data-footer-wordmark
      className="logo-text -ml-[0.073em] flex w-[calc(100%+0.1385em)] items-end justify-between pb-[clamp(0.35rem,0.7vw,0.7rem)] text-[25.5vw] font-normal uppercase leading-[0.72] md:text-[28vw]"
      aria-hidden="true"
    >
      {letters.map((character) => (
        <span
          key={character}
          className="-mx-[0.04em] block overflow-hidden px-[0.04em] pt-[0.055em]"
        >
          <span
            data-footer-letter
            className="block will-change-transform"
          >
            {character}
          </span>
        </span>
      ))}
    </div>
  );
}
