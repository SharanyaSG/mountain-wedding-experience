import type { CSSProperties } from "react";
import art from "@/assets/autumn-mountain-arbor-illustration.png";
import plate from "@/assets/hero-art/plate.png";
import cabin from "@/assets/hero-art/gondola.png";
import hairArt from "@/assets/hero-art/hair.png";
import pineTall from "@/assets/hero-art/pine-tall.png";
import pineSmall from "@/assets/hero-art/pine-small.png";
import leaf0 from "@/assets/hero-art/leaf0.png";
import leaf1 from "@/assets/hero-art/leaf1.png";
import leaf2 from "@/assets/hero-art/leaf2.png";
import leaf3 from "@/assets/hero-art/leaf3.png";
import leaf4 from "@/assets/hero-art/leaf4.png";
import leaf5 from "@/assets/hero-art/leaf5.png";
import leaf6 from "@/assets/hero-art/leaf6.png";
import leaf7 from "@/assets/hero-art/leaf7.png";

/**
 * The couple's watercolor, brought to life with isolated layers cut from the
 * same painting:
 *  - "plate" is the original with the gondola cabins, her hair, the two pines
 *    and the moving foliage painted out, so moving layers never uncover a
 *    stationary copy;
 *  - one shared wind (styles.css: art-gust) moves the pines, the bushes and her
 *    hair the same way, left to right, each gust reaching the left of the scene
 *    first. As a gust reaches a bush, a leaf breaks off and flutters down.
 *  - cabins hang from the cable (traced from the painting's upper cable) on a
 *    drawn hanger, come out of the lower station building and ride up under the
 *    summit canopy into the station. A mask keeps them behind both stations.
 * With reduced motion, the untouched original is shown instead.
 */
const W = 1774;
const H = 887;
// The painting's top 336 px are blank sky; show from just above the arbor, so the art sits closer to the text.
const TOP = 300;

// The wind: one gust every GUST seconds, peaking PEAK seconds in, taking TRAVEL seconds to cross the scene.
const GUST = 8;
const PEAK = GUST * 0.4;
const TRAVEL = 1.2;
const gustDelay = (x: number) => (x / W) * TRAVEL;

type Layer = {
  src: string;
  box: [number, number, number, number];
  cls: "art-gust" | "art-hair";
  strength: number;
};

// strength = lean in degrees at the peak of a gust (skew, for the hair).
const trees: Layer[] = [
  { src: pineTall, box: [113, 351, 146, 314], cls: "art-gust", strength: 3.4 },
  { src: pineSmall, box: [45, 489, 83, 176], cls: "art-gust", strength: 4.2 },
];
const bushes: Layer[] = [
  { src: leaf0, box: [35, 600, 140, 152], cls: "art-gust", strength: 6.5 },
  { src: leaf1, box: [205, 535, 87, 105], cls: "art-gust", strength: 7.5 },
  { src: leaf2, box: [378, 680, 74, 92], cls: "art-gust", strength: 7.5 },
  { src: leaf3, box: [555, 690, 145, 102], cls: "art-gust", strength: 6.5 },
  { src: leaf7, box: [880, 755, 125, 80], cls: "art-gust", strength: 6.5 },
  { src: leaf6, box: [1250, 640, 135, 105], cls: "art-gust", strength: 6.5 },
  { src: leaf4, box: [1410, 575, 112, 130], cls: "art-gust", strength: 6.5 },
  { src: leaf5, box: [1558, 545, 174, 137], cls: "art-gust", strength: 6.0 },
];
const hair: Layer = { src: hairArt, box: [437, 514, 62, 85], cls: "art-hair", strength: 9 };

// The upper cable, fitted to the painting pixel by pixel: from inside the lower station's roof, up to where
// it meets the summit canopy, then up under the canopy into the station building. Each point is where a
// cabin's hanger grips the cable.
const CABLE: [number, number][] = [
  [962, 733.3],
  [966, 730.4],
  [978, 721.7],
  [990, 713.2],
  [1002, 704.7],
  [1014, 696.3],
  [1026, 687.9],
  [1038, 679.5],
  [1050, 671.2],
  [1062, 662.8],
  [1074, 654.4],
  [1086, 646],
  [1098, 637.4],
  [1110, 628.8],
  [1122, 620.1],
  [1134, 611.2],
  [1146, 602.1],
  [1158, 592.9],
  [1170, 583.5],
  [1182, 573.9],
  [1194, 564],
  [1206, 553.9],
  [1218, 543.6],
  [1230, 532.9],
  [1242, 521.9],
  [1254, 510.6],
  [1266, 498.9],
  [1278, 486.9],
  [1290, 474.4],
  [1302, 461.6],
  [1313, 449],
  [1320, 443],
  [1327, 435],
  [1335, 428],
  [1345, 424],
  [1360, 424],
];
const CABLE_PATH = "M" + CABLE.map(([x, y]) => `${x} ${y}`).join(" L");
// Fraction of the trip (by distance, as animateMotion paces it) at which the hanger reaches x.
const lengths = CABLE.slice(1).map(([x, y], i) => Math.hypot(x - CABLE[i]![0], y - CABLE[i]![1]));
const total = lengths.reduce((a, b) => a + b, 0);
function tripAt(x: number) {
  let run = 0;
  for (let i = 0; i < lengths.length; i++) {
    const [x0] = CABLE[i]!;
    const [x1] = CABLE[i + 1]!;
    if (x <= x1) return (run + lengths[i]! * ((x - x0) / (x1 - x0))) / total;
    run += lengths[i]!;
  }
  return 1;
}
// Visible once the whole cabin is clear of the lower station's base; inside the summit station it fades away.
const FADE = [0, tripAt(972), tripAt(1336), tripAt(1352), 1].map((t) => t.toFixed(4)).join(";");

// Station outlines traced from the painting; cabins are hidden behind them (black = hidden).
const LOWER_STATION = "930,728 960,728 994,747 994,750 990,750 990,766 930,766";
const SUMMIT_BEAM = "1307,440 1336,437 1336,446 1307,446";
const SUMMIT_POST = "1325,446 1331,446 1331,464 1325,464";
const SUMMIT_BUILDING = "1333,434 1349,420 1392,432 1392,466 1333,466";
const TRIP = 15; // seconds per ascent
const CABINS = 4;
const HANGER = 15; // px from cable to cabin roof
const CABIN_W = 27;
const CABIN_H = 25;

/*
 * Falling leaves. Each breaks off a bush as a gust reaches it, then falls on the wind: drifting right while
 * swinging side to side like a pendulum, tilting into each swing, and settling to the ground. It falls once
 * every LEAF_CYCLE seconds (on gust number `gust` of each cycle), so only one or two are ever in the air.
 */
const MAPLE =
  "M0 -8L1.6 -4.2L4.6 -5.6L3.6 -1.6L7.6 -1.2L4.4 1.6L5.6 4L1.4 3.2L0.6 7L0 5.4L-0.6 7L-1.4 3.2L-5.6 4L-4.4 1.6" +
  "L-7.6 -1.2L-3.6 -1.6L-4.6 -5.6L-1.6 -4.2Z";
const LEAF_CYCLE = GUST * 3;
const FALL = 5.4; // seconds from breaking off to landing
const SWINGS = 2.5;
const fallingLeaves = [
  { from: [120, 642], drop: [115, 118], color: "#E07B39", gust: 0 },
  { from: [600, 702], drop: [95, 82], color: "var(--crimson)", gust: 1 },
  { from: [1300, 656], drop: [100, 90], color: "#E8A33D", gust: 2 },
  { from: [245, 560], drop: [75, 108], color: "#D2452E", gust: 1 },
  { from: [1630, 566], drop: [90, 112], color: "var(--rust)", gust: 0 },
  { from: [1455, 592], drop: [100, 108], color: "#D98A3D", gust: 2 },
] as const;

function leafFall(x0: number, y0: number, dx: number, dy: number) {
  const done = FALL / LEAF_CYCLE;
  const points: string[] = [];
  const angles: string[] = [];
  const times: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const phase = 2 * Math.PI * SWINGS * t;
    const swing = 16 * Math.sin(phase) * (1 - 0.4 * t);
    // A leaf lifts a little at the end of each swing and drops fastest through the middle.
    points.push(
      `${(x0 + dx * t + swing).toFixed(1)} ${(y0 + dy * t - 4 * Math.abs(Math.sin(phase))).toFixed(1)}`,
    );
    angles.push((38 * Math.cos(phase) * (1 - 0.3 * t) + 12).toFixed(1));
    times.push((t * done).toFixed(4));
  }
  return {
    path: "M" + points.join(" L"),
    motionTimes: `0;${done.toFixed(4)};1`,
    angles: [...angles, angles.at(-1)].join(";"),
    angleTimes: [...times, "1"].join(";"),
    fadeTimes: [0, 0.25 / LEAF_CYCLE, (FALL - 0.8) / LEAF_CYCLE, done, 1]
      .map((t) => t.toFixed(4))
      .join(";"),
  };
}

function Piece({ l }: { l: Layer }) {
  const [x, y, w, h] = l.box;
  // Negative delay keeps every piece mid-cycle from the start; a larger x is further behind in the gust.
  const style = {
    "--a": l.strength,
    animationDelay: `${gustDelay(x + w / 2) - GUST}s`,
  } as CSSProperties;
  return <image href={l.src} x={x} y={y} width={w} height={h} className={l.cls} style={style} />;
}

export function HeroIllustration() {
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H - TOP}` }}>
      <img
        src={art}
        alt="Watercolor illustration: Sharanya and Sahil, seen from behind, look out over autumn mountains as gondolas climb toward a flower-covered wedding arbor at the summit"
        width={W}
        height={H}
        loading="lazy"
        className="art-static absolute inset-0 h-full w-full object-cover object-bottom"
      />
      <svg
        className="art-live absolute inset-0 h-full w-full"
        viewBox={`0 ${TOP} ${W} ${H - TOP}`}
        role="img"
        aria-label="Watercolor illustration: Sharanya and Sahil, seen from behind, look out over autumn mountains as gondolas climb toward a flower-covered wedding arbor at the summit"
        data-testid="hero-art"
      >
        <defs>
          <mask
            id="hero-cabin-stations"
            maskUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={W}
            height={H}
          >
            <rect x={0} y={0} width={W} height={H} fill="white" />
            <polygon points={LOWER_STATION} fill="black" />
            <polygon points={SUMMIT_BEAM} fill="black" />
            <polygon points={SUMMIT_POST} fill="black" />
            <polygon points={SUMMIT_BUILDING} fill="black" />
          </mask>
        </defs>
        <image href={plate} x={0} y={0} width={W} height={H} />
        <g mask="url(#hero-cabin-stations)">
          {Array.from({ length: CABINS }, (_, i) => {
            const begin = `${(-i * TRIP) / CABINS}s`;
            return (
              <g key={i} className="art-cabin">
                <line
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={HANGER + 1}
                  stroke="#4a3d33"
                  strokeWidth={1.4}
                  strokeLinecap="round"
                />
                <image href={cabin} x={-CABIN_W / 2} y={HANGER} width={CABIN_W} height={CABIN_H} />
                <animateMotion
                  dur={`${TRIP}s`}
                  begin={begin}
                  repeatCount="indefinite"
                  path={CABLE_PATH}
                />
                <animate
                  attributeName="opacity"
                  dur={`${TRIP}s`}
                  begin={begin}
                  repeatCount="indefinite"
                  values="0;1;1;0;0"
                  keyTimes={FADE}
                />
              </g>
            );
          })}
        </g>
        {trees.map((l, i) => (
          <Piece key={`t${i}`} l={l} />
        ))}
        <Piece l={hair} />
        {bushes.map((l, i) => (
          <Piece key={`b${i}`} l={l} />
        ))}
        {fallingLeaves.map((leaf, i) => {
          const [x0, y0] = leaf.from;
          const fall = leafFall(x0, y0, leaf.drop[0], leaf.drop[1]);
          // Break off just as this bush's gust peaks.
          const begin = `${(leaf.gust * GUST + PEAK + gustDelay(x0) - 0.2).toFixed(2)}s`;
          const timing = { dur: `${LEAF_CYCLE}s`, begin, repeatCount: "indefinite" } as const;
          return (
            <g key={`f${i}`} opacity={0}>
              <g>
                <path d={MAPLE} fill={leaf.color} transform="scale(1.5)" />
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values={fall.angles}
                  keyTimes={fall.angleTimes}
                  {...timing}
                />
              </g>
              <animateMotion
                path={fall.path}
                keyPoints="0;1;1"
                keyTimes={fall.motionTimes}
                calcMode="linear"
                {...timing}
              />
              <animate
                attributeName="opacity"
                values="0;0.95;0.95;0;0"
                keyTimes={fall.fadeTimes}
                {...timing}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
