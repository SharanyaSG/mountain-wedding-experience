import art from "@/assets/autumn-mountain-arbor-illustration.png.asset.json";

/**
 * The couple's finalized watercolor, shown untouched. Motion comes only from
 * feathered "sprites" — tiny windows of the same image laid exactly over
 * themselves and nudged by fractions of a degree — plus two painted leaves.
 * Mountains, cable, towers and arbor are never covered, so they stay still.
 */
const W = 1774;
const H = 887;

type Box = { x: number; y: number; w: number; h: number };

function spriteStyle({ x, y, w, h }: Box, origin: string): React.CSSProperties {
  return {
    left: `${(x / W) * 100}%`,
    top: `${(y / H) * 100}%`,
    width: `${(w / W) * 100}%`,
    height: `${(h / H) * 100}%`,
    backgroundImage: `url(${art.url})`,
    backgroundSize: `${(W / w) * 100}% ${(H / h) * 100}%`,
    backgroundPosition: `${(x / (W - w)) * 100}% ${(y / (H - h)) * 100}%`,
    transformOrigin: origin,
  };
}

const gondolas: Box[] = [
  { x: 1298, y: 446, w: 30, h: 38 },
  { x: 1260, y: 487, w: 32, h: 42 },
  { x: 1130, y: 594, w: 37, h: 50 },
  { x: 998, y: 694, w: 35, h: 44 },
];

const foliage: (Box & { delay: number })[] = [
  { x: 205, y: 540, w: 80, h: 100, delay: 0 },
  { x: 40, y: 610, w: 110, h: 110, delay: -3 },
  { x: 1415, y: 585, w: 100, h: 110, delay: -5 },
  { x: 1575, y: 555, w: 90, h: 95, delay: -1.5 },
  { x: 630, y: 725, w: 80, h: 70, delay: -4 },
];

export function HeroIllustration() {
  return (
    <div className="hero-art relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <img
        src={art.url}
        alt="Watercolor illustration: Sharanya and Sahil, seen from behind, look out over autumn mountains as gondolas climb toward a flower-covered wedding arbor at the summit"
        width={W}
        height={H}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full"
      />
      <div aria-hidden="true" className="hero-art-motion absolute inset-0">
        {foliage.map((b, i) => (
          <span key={i} className="art-sprite art-foliage" style={{ ...spriteStyle(b, "50% 100%"), animationDelay: `${b.delay}s` }} />
        ))}
        <span className="art-sprite art-hair" style={spriteStyle({ x: 436, y: 514, w: 76, h: 88 }, "50% 0%")} />
        {gondolas.map((b, i) => (
          <span key={i} className="art-sprite art-gondola" style={{ ...spriteStyle(b, "50% 8%"), animationDelay: `${-i * 1.7}s` }} />
        ))}
        <svg className="art-leaf art-leaf-a" viewBox="0 0 20 20"><path d="M10 1C15 5 17 11 10 19 3 11 5 5 10 1Z" /></svg>
        <svg className="art-leaf art-leaf-b" viewBox="0 0 20 20"><path d="M10 1C15 5 17 11 10 19 3 11 5 5 10 1Z" /></svg>
      </div>
    </div>
  );
}
