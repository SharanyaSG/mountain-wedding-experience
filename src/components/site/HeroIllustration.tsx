import art from "@/assets/autumn-mountain-arbor-illustration.png.asset.json";
import plate from "@/assets/hero-art/plate.png.asset.json";
import gondola from "@/assets/hero-art/gondola.png.asset.json";
import hair0 from "@/assets/hero-art/hair0.png.asset.json";
import hair1 from "@/assets/hero-art/hair1.png.asset.json";
import hair2 from "@/assets/hero-art/hair2.png.asset.json";
import leaf0 from "@/assets/hero-art/leaf0.png.asset.json";
import leaf1 from "@/assets/hero-art/leaf1.png.asset.json";
import leaf2 from "@/assets/hero-art/leaf2.png.asset.json";
import leaf3 from "@/assets/hero-art/leaf3.png.asset.json";
import leaf4 from "@/assets/hero-art/leaf4.png.asset.json";
import leaf5 from "@/assets/hero-art/leaf5.png.asset.json";
import leaf6 from "@/assets/hero-art/leaf6.png.asset.json";
import leaf7 from "@/assets/hero-art/leaf7.png.asset.json";

/**
 * The couple's watercolor, brought to life with isolated layers cut from the
 * same painting:
 *  - "plate" is the original with only the four gondola cabins painted out,
 *    so moving cabins never sit on top of stationary duplicates;
 *  - transparent foliage and hair cut-outs sway on their own pivots;
 *  - one cabin cut-out travels up the cable path (traced from the hanger
 *    points in the original), staying upright.
 * With reduced motion, the untouched original is shown instead.
 */
const W = 1774;
const H = 887;

type Layer = { src: string; box: [number, number, number, number]; cls: string; dur: number; delay: number };

const leaves: Layer[] = [
  { src: leaf0.url, box: [35, 600, 140, 152], cls: "art-sway", dur: 6.2, delay: 0 },
  { src: leaf1.url, box: [205, 535, 87, 105], cls: "art-sway", dur: 4.8, delay: -1.2 },
  { src: leaf2.url, box: [378, 680, 74, 92], cls: "art-sway-b", dur: 5.4, delay: -2.5 },
  { src: leaf3.url, box: [555, 690, 145, 102], cls: "art-sway", dur: 7, delay: -3.1 },
  { src: leaf7.url, box: [880, 755, 125, 80], cls: "art-sway-b", dur: 6.6, delay: -0.7 },
  { src: leaf6.url, box: [1250, 640, 135, 105], cls: "art-sway", dur: 5.8, delay: -4 },
  { src: leaf4.url, box: [1410, 575, 112, 130], cls: "art-sway-b", dur: 5.1, delay: -1.9 },
  { src: leaf5.url, box: [1558, 545, 174, 137], cls: "art-sway", dur: 6.9, delay: -2.2 },
];
const hair: Layer[] = [
  { src: hair0.url, box: [434, 512, 28, 92], cls: "art-hair", dur: 5.2, delay: -0.4 },
  { src: hair1.url, box: [462, 512, 26, 92], cls: "art-hair", dur: 6.1, delay: -2.1 },
  { src: hair2.url, box: [488, 512, 26, 92], cls: "art-hair", dur: 4.7, delay: -3.3 },
];

// Cable path through the cabin hanger points, lower station → summit station.
const CABLE = "M975 726 L1015 697 L1152 597 L1274 490 L1314 452 L1322 445";
const TRIP = 42.7; // seconds per ascent (about 50% faster than the original 64s)
const CABINS = 4;

function Piece({ l }: { l: Layer }) {
  const [x, y, w, h] = l.box;
  return (
    <image
      href={l.src}
      x={x}
      y={y}
      width={w}
      height={h}
      className={l.cls}
      style={{ animationDuration: `${l.dur}s`, animationDelay: `${l.delay}s` }}
    />
  );
}

export function HeroIllustration() {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
      <img
        src={art.url}
        alt="Watercolor illustration: Sharanya and Sahil, seen from behind, look out over autumn mountains as gondolas climb toward a flower-covered wedding arbor at the summit"
        width={W}
        height={H}
        loading="lazy"
        className="art-static absolute inset-0 h-full w-full"
      />
      <svg
        className="art-live absolute inset-0 h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Watercolor illustration: Sharanya and Sahil, seen from behind, look out over autumn mountains as gondolas climb toward a flower-covered wedding arbor at the summit"
        data-testid="hero-art"
      >
        <image href={plate.url} x={0} y={0} width={W} height={H} />
        {Array.from({ length: CABINS }, (_, i) => (
          <g key={i} className="art-cabin">
            <image href={gondola.url} x={-21} y={-1} width={37} height={47} />
            <animateMotion dur={`${TRIP}s`} begin={`${(-i * TRIP) / CABINS}s`} repeatCount="indefinite" path={CABLE} />
            <animate attributeName="opacity" dur={`${TRIP}s`} begin={`${(-i * TRIP) / CABINS}s`} repeatCount="indefinite" values="0;1;1;0" keyTimes="0;0.05;0.93;1" />
          </g>
        ))}
        {hair.map((l, i) => <Piece key={`h${i}`} l={l} />)}
        {leaves.map((l, i) => <Piece key={`l${i}`} l={l} />)}
        <path className="art-leaf art-leaf-a" d="M0 -9C5 -5 7 1 0 9 -7 1 -5 -5 0 -9Z" transform="translate(250 560)" />
        <path className="art-leaf art-leaf-b" d="M0 -8C4 -4 6 1 0 8 -6 1 -4 -4 0 -8Z" transform="translate(1600 580)" />
        <path className="art-leaf art-leaf-c" d="M0 -7C4 -4 5 1 0 7 -5 1 -4 -4 0 -7Z" transform="translate(130 640)" />
      </svg>
    </div>
  );
}
