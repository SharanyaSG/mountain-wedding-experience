export function SectionHeading({
  title,
  accent,
  label,
  align = "left",
  crimson = false,
}: {
  title: string;
  accent: string;
  label?: string;
  align?: "left" | "center";
  crimson?: boolean;
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      {label && <p className="eyebrow font-bold text-left text-rust">{label}</p>}
      <div className={label ? "mt-6" : ""}>
        <h2 className="display text-4xl uppercase leading-tight text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h2>
        <p
          className={`mt-4 font-script text-4xl leading-tight md:text-5xl ${crimson ? "text-romantic-crimson" : "text-rust"}`}
        >
          {accent}
        </p>
      </div>
    </div>
  );
}
