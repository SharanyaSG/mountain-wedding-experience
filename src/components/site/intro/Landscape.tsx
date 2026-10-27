import { introState, progress, smooth } from "./timeline";

const autumnTrees = [
  [170, 690, 1.4], [790, 695, 1.5], [85, 760, 1.8], [900, 775, 1.9],
  [245, 630, .8], [725, 625, .9], [300, 585, .55], [680, 580, .6],
] as const;

function Tree({ x, y, scale, index, winter }: { x: number; y: number; scale: number; index: number; winter: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <g opacity={1 - winter}>
      <path d="M0 0 Q-7 -42 0 -120 M-2 -45 L-28 -80 M-1 -65 L27 -96 M-1 -86 L-18 -109" className="intro-trunk" />
      {Array.from({ length: 24 }, (_, i) => {
        const angle = i * 2.399;
        const radius = 9 + Math.sqrt(i) * 8;
        return <ellipse key={i} cx={Math.cos(angle) * radius} cy={-88 + Math.sin(angle) * radius * .85} rx={14 + i % 5} ry={9 + i % 4} transform={`rotate(${i * 29} ${Math.cos(angle) * radius} ${-88 + Math.sin(angle) * radius * .85})`} className={`intro-foliage intro-leaf-${(i + index) % 4}`} />;
      })}
    </g>
    <g opacity={winter}>
      <path d="M0 0 L0 -145" className="intro-trunk" />
      <path d="M0 -152 L-23 -106 L-13 -111 L-35 -73 L-23 -78 L-48 -28 Q0 -8 48 -28 L23 -78 L35 -73 L13 -111 L23 -106Z" className="intro-evergreen" />
      <path d="M0 -152 L-19 -114 Q0 -104 19 -114 M-11 -105 L-30 -78 Q0 -66 30 -78 M-22 -64 L-43 -33 Q0 -20 43 -33" className="intro-tree-snow" />
    </g>
  </g>;
}

function Walker({ x, y, phase, moving, smaller = false, turn = 0 }: { x: number; y: number; phase: number; moving: boolean; smaller?: boolean; turn?: number }) {
  const stride = moving ? Math.sin(phase) : 0;
  const lift = moving ? Math.cos(phase * 2) * 1.4 : 0;
  const hipY = -29;
  return <g transform={`translate(${x} ${y + lift}) scale(${smaller ? .9 : 1})`} className="intro-person">
    <g transform={`rotate(${-5 + turn} 0 -25)`}>
      <circle cx="1" cy="-67" r="6.5" />
      {smaller && <path d="M-3 -71 Q-13 -72 -11 -59 L-7 -54 L-5 -66Z" />}
      <path d="M-2 -58 Q-10 -55 -9 -44 L-7 -28 L7 -28 L7 -47 Q7 -57 2 -58Z" />
      <g className="intro-limbs">
        <path d={`M-5 -53 L${-9 - stride * 7} -39 L${-7 - stride * 11} -29`} />
        <path d={`M5 -53 L${10 + stride * 6} -40 L${8 + stride * 11} -29`} />
        <path d={`M-4 ${hipY} L${-4 + stride * 9} -14 L${-4 + stride * 17} ${-1 - Math.max(0, -stride) * 5}`} />
        <path d={`M4 ${hipY} L${4 - stride * 9} -14 L${4 - stride * 17} ${-1 - Math.max(0, stride) * 5}`} />
      </g>
    </g>
  </g>;
}

function Skier({ x, y, phase, smaller = false }: { x: number; y: number; phase: number; smaller?: boolean }) {
  const carve = Math.sin(phase);
  const bend = 5 + Math.sin(phase * 2) * 3;
  return <g transform={`translate(${x} ${y}) rotate(${carve * 12}) scale(${smaller ? .86 : 1})`}>
    <g className="intro-powder" opacity={.45}>
      {[0, 1, 2, 3, 4].map(i => <circle key={i} cx={-30 - i * 6 - Math.sin(phase + i) * 5} cy={-2 - i * 3} r={2 + i % 3} />)}
    </g>
    <g className="intro-person">
      <g transform={`rotate(${18 + carve * 8} 0 -25)`}>
        <circle cx="-1" cy="-60" r="6.5" />
        {smaller && <path d="M-5 -63 Q-19 -64 -22 -55 L-7 -56Z" />}
        <path d="M-4 -52 Q-11 -49 -9 -33 L-4 -24 L6 -26 L6 -44 Q6 -52 0 -52Z" />
        <g className="intro-limbs">
          <path d={`M-6 -46 L-15 -32 L${-5 + carve * 3} -24 M5 -46 L16 -34 L${24 + carve * 4} -30`} />
          <path d={`M-4 -26 L${10 + bend} -15 L-8 -3 M4 -25 L${21 + bend} -13 L8 0`} />
        </g>
      </g>
      <path d="M-32 -1 Q-5 3 34 1 Q42 1 43 -3 M-18 7 Q6 11 44 8 Q51 7 51 3" className="intro-skis" />
      <path d={`M-5 -26 L-26 4 M${24 + carve * 4} -30 L39 5`} className="intro-poles" />
    </g>
  </g>;
}

export function Landscape({ time, playing }: { time: number; playing: boolean }) {
  const state = introState(time);
  const winter = state.winter;
  const hike = smooth(progress(time, 3, 8));
  const approach = smooth(progress(time, 8, 10.5));
  const ski = progress(time, 23, 27);
  const characterOpacity = playing ? (time < 3 ? 0 : time < 12.5 ? Math.min(1, (time - 3) * 2) : time < 14 ? 1 - progress(time, 12.5, 14) : time >= 23 ? 1 - progress(time, 27, 28) : 0) : 0;
  const camera = playing ? 1.035 - .035 * smooth(progress(time, 10, 16)) : 1;
  return <svg className="intro-landscape" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMax slice" role="img" aria-label={winter > .5 ? "Illustrated snowy mountains and two silhouettes skiing" : "Illustrated autumn mountains and a couple hiking to a fictional overlook"}>
    <defs>
      <linearGradient id="intro-sunset" x2="0" y2="1"><stop className="intro-sky-top" /><stop offset=".52" className="intro-sky-mid" /><stop offset="1" className="intro-sky-low" /></linearGradient>
      <linearGradient id="intro-winter-sky" x2="0" y2="1"><stop className="intro-cold-top" /><stop offset="1" className="intro-cold-low" /></linearGradient>
      <radialGradient id="intro-glow"><stop className="intro-sun" stopOpacity=".75" /><stop offset="1" className="intro-sun" stopOpacity="0" /></radialGradient>
      <linearGradient id="intro-mist" x2="0" y2="1"><stop className="intro-mist-color" stopOpacity="0" /><stop offset=".5" className="intro-mist-color" stopOpacity=".5" /><stop offset="1" className="intro-mist-color" stopOpacity="0" /></linearGradient>
      <filter id="intro-paper"><feTurbulence type="fractalNoise" baseFrequency=".65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncA type="linear" slope=".065" /></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply" /></filter>
    </defs>
    <rect width="1000" height="800" fill="url(#intro-sunset)" />
    <rect width="1000" height="800" fill="url(#intro-winter-sky)" opacity={winter} />
    <circle cx="395" cy="330" r="200" fill="url(#intro-glow)" opacity={1 - winter} />
    <circle cx="395" cy="330" r="24" className="intro-sun-fill" opacity={1 - winter * .7} />
    <g className={playing ? "intro-clouds is-moving" : "intro-clouds"} opacity={.42}>
      <path d="M75 238 Q130 220 190 237 Q248 223 290 241 Q214 249 120 246Z M570 178 Q620 166 653 179 Q700 168 755 185 Q665 191 570 178Z M760 280 Q805 267 850 277 Q905 263 959 283 L760 285Z" />
    </g>
    <g transform={`translate(${500 - 500 * camera} ${420 - 420 * camera}) scale(${camera})`}>
      <g transform={`translate(${playing ? Math.sin(time / 15) * 5 : 0} 0)`}>
        <path d="M-50 407 Q40 350 100 363 L188 329 L266 355 L344 336 L427 381 L526 334 L618 360 L699 322 L777 365 L865 337 L1040 415 V810 H-50Z" className="intro-ridge-far" />
        <path d="M-30 461 L54 406 L131 426 Q186 400 221 380 L307 430 L397 391 L488 449 L609 394 L691 420 L805 381 L906 432 L1030 396 V810 H-30Z" className="intro-ridge-mid" />
        <path d="M-30 461 L54 406 L131 426 Q186 400 221 380 L244 413 L221 401 L202 414 L195 401 L158 425 L130 442 L55 426 L38 431Z M603 406 L609 394 L691 420 L715 411 L692 437 L656 423 L638 427Z M756 402 L805 381 L834 396 L805 398 L785 408Z" className="intro-snow" opacity={winter} />
      </g>
      <path d="M-40 518 Q39 448 115 470 L217 428 Q281 460 348 482 L421 460 L534 495 L672 443 L766 481 Q882 421 1040 491 V820 H-40Z" className="intro-ridge-near" />
      <path d="M0 489 Q170 456 300 485 Q480 510 626 478 Q820 447 1000 479 V536 Q800 499 620 530 Q370 555 0 525Z" fill="url(#intro-mist)" />
      <path d="M-30 614 Q100 503 209 527 Q331 540 430 559 Q544 503 664 530 Q780 550 1030 482 V820 H-30Z" className="intro-foothill" />
      <path d="M-30 614 Q100 503 209 527 Q331 540 430 559 Q544 503 664 530 Q780 550 1030 482 V820 H-30Z" className="intro-snow" opacity={winter * .86} />
      <path d="M-20 760 Q180 640 347 638 L437 569 Q505 542 572 570 L654 627 Q810 635 1020 735 V830 H-20Z" className="intro-ground" />
      <path d="M-20 760 Q180 640 347 638 L437 569 Q505 542 572 570 L654 627 Q810 635 1020 735 V830 H-20Z" className="intro-snow" opacity={winter} />
      <path d="M299 808 Q367 736 416 684 Q460 650 461 610 Q470 582 522 566" className="intro-trail" opacity={1 - winter} />
      <g opacity={1 - winter} className="intro-rocks">
        <path d="M408 586 L429 566 L458 571 L467 591Z M485 579 L502 563 L532 569 L543 584Z M561 596 L575 583 L606 587 L616 609Z M353 643 L375 628 L396 635 L405 650Z" />
      </g>
      {autumnTrees.map(([x, y, scale], i) => <Tree key={i} x={x} y={y} scale={scale} index={i} winter={winter} />)}
      <g opacity={playing ? progress(time, 7.5, 9) * (1 - progress(time, 12.5, 14)) : 0}>
        <path d="M457 565 L457 460 Q499 455 558 458 L558 569 M450 461 L565 457" className="intro-arbor" />
        <path d="M454 480 L472 461 M539 460 L558 479" className="intro-arbor-brace" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <ellipse key={i} cx={546 + Math.sin(i * 2) * 13} cy={454 + i * 5} rx="9" ry="3.5" transform={`rotate(${i * 32} 546 ${454 + i * 5})`} className={`intro-leaf-${i % 4}`} />)}
      </g>
      <g opacity={characterOpacity}>
        {time < 23 ? <>
          <Walker x={365 + hike * 96 + approach * 25} y={636 - hike * 55 - approach * 7} phase={time * 7.8} moving={state.hiking || (state.summit && time < 10.5)} smaller turn={smooth(progress(time, 10.5, 11.5)) * 7} />
          <Walker x={405 + hike * 91 + approach * 26} y={621 - hike * 42 - approach * 5} phase={time * 7.8 + 1.7} moving={state.hiking || (state.summit && time < 10.5)} turn={-smooth(progress(time, 10.5, 11.5)) * 7} />
        </> : <>
          <path d={`M468 581 Q${480 + Math.sin(time * 2) * 20} 616 ${477 + ski * 86} ${590 + ski * 112}`} className="intro-ski-track" />
          <path d={`M515 585 Q${540 + Math.sin(time * 2) * 20} 638 ${537 + ski * 72} ${615 + ski * 112}`} className="intro-ski-track" />
          <Skier x={477 + ski * 86 + Math.sin(time * 2.5) * 16} y={590 + ski * 112} phase={time * 3} smaller />
          <Skier x={537 + ski * 72 + Math.sin(time * 2.5 + 1) * 16} y={615 + ski * 112} phase={time * 3 + 1.1} />
        </>}
      </g>
    </g>
    {playing && time < 23 && <g opacity={time > 20 ? 1 - winter : .65}>
      {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={310 + ((i * 59 + time * (12 + i)) % 380)} cy={(i * 91 + time * (8 + i * 2)) % 800} rx={4 + i % 3} ry="2" transform={`rotate(${time * 45 + i * 30} ${310 + ((i * 59 + time * (12 + i)) % 380)} ${(i * 91 + time * (8 + i * 2)) % 800})`} className={`intro-leaf-${i % 4}`} />)}
    </g>}
    {winter > 0 && <g className="intro-snowflakes" opacity={winter * .7}>
      {Array.from({ length: 35 }, (_, i) => <circle key={i} cx={(i * 127 + Math.sin(time + i) * 10) % 1000} cy={(i * 97 + time * (9 + i % 6)) % 800} r={1 + i % 3 * .5} />)}
    </g>}
    <rect width="1000" height="800" className="intro-texture" filter="url(#intro-paper)" />
  </svg>;
}