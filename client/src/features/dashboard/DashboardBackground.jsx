/**
 * DashboardBackground
 *
 * A full-screen, fixed, continuously-animating hand-drawn illustration that
 * lives behind the entire dashboard UI. It never participates in layout —
 * the parent positions it with  `fixed inset-0 -z-10 pointer-events-none`.
 *
 * Technique: every <path> carries pathLength="1" and a CSS custom property
 * pair (--bg-cycle, --bg-delay). The @keyframes bgSketch animates
 * stroke-dashoffset from 1 → 0 (draw in), holds, then fades out and resets —
 * creating a seamless loop. Staggered cycles (9 s – 28 s) and delays
 * (0 s – 18 s) keep the composition constantly alive without any two strokes
 * moving in lockstep.
 *
 * Opacity is deliberately very low (ink at 8-14 %, vermilion at 12-18 %) so
 * the main content remains fully readable at all times.
 *
 * Accessibility: aria-hidden="true" on the SVG. Reduced-motion media query
 * freezes every path at its fully-drawn state (no animation, full opacity).
 */
export default function DashboardBackground() {
  return (
    <>
      <style>{`
        /* ── keyframes ────────────────────────────────────────────────── */
        @keyframes bgSketch {
          0%   { stroke-dashoffset: 1; opacity: 0;                     }
          4%   { stroke-dashoffset: 1; opacity: var(--bg-op, 1);       }
          32%  { stroke-dashoffset: 0; opacity: var(--bg-op, 1);       }
          68%  { stroke-dashoffset: 0; opacity: var(--bg-op, 1);       }
          84%  { stroke-dashoffset: 0; opacity: 0;                     }
          100% { stroke-dashoffset: 1; opacity: 0;                     }
        }

        /* ── shared path class ────────────────────────────────────────── */
        .bg-sk {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          fill: none;
          animation: bgSketch var(--bg-cycle, 16s) ease-in-out infinite;
          animation-delay: var(--bg-delay, 0s);
          will-change: stroke-dashoffset, opacity;
        }

        /* ── reduced-motion: freeze at fully drawn, very faint ────────── */
        @media (prefers-reduced-motion: reduce) {
          .bg-sk {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: calc(var(--bg-op, 1) * 0.6) !important;
          }
        }
      `}</style>

      {/*
        Single SVG that covers the viewport.
        viewBox is 1440 × 900 (common desktop aspect) with overflow:visible so
        paths can bleed beyond the box on larger screens.
        preserveAspectRatio="xMidYMid slice" scales up to cover, like a CSS
        background-size:cover.
      */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
        className="h-full w-full"
        fill="none"
      >

        {/* ════════════════════════════════════════════════════════════════
            ZONE A — TOP-LEFT QUADRANT
            A giant sprawling face profile: forehead arc → brow → nose →
            lips → chin. Drawn in slow, sweeping strokes.
            ════════════════════════════════════════════════════════════════ */}

        {/* Skull / forehead dome */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'24s','--bg-delay':'0s','--bg-op':0.13}}
          d="M -40 520 C 20 380, 80 200, 220 120 C 330 55, 430 70, 480 140"
          stroke="#14110f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Brow ridge */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'3s','--bg-op':0.11}}
          d="M 180 210 C 220 195, 280 190, 340 205"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Eye socket arc */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'5s','--bg-op':0.12}}
          d="M 195 240 C 230 220, 310 218, 345 238 C 310 258, 230 260, 195 240 Z"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Pupil — vermilion circle */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'11s','--bg-delay':'6.5s','--bg-op':0.16}}
          d="M 255 240 A 18 18 0 1 1 255 239.9 Z"
          stroke="#e8441e" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Iris detail cross */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'9s','--bg-delay':'7s','--bg-op':0.14}}
          d="M 255 226 V 254 M 241 240 H 269"
          stroke="#e8441e" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Nose bridge + tip */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'2s','--bg-op':0.10}}
          d="M 300 250 C 295 300, 280 340, 260 365 C 245 382, 220 390, 215 375"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Nostril flare */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'7.5s','--bg-op':0.09}}
          d="M 215 375 C 200 385, 190 390, 195 400 C 200 408, 225 402, 230 390"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Upper lip */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'9s','--bg-op':0.10}}
          d="M 175 440 C 200 430, 220 424, 240 428 C 225 418, 210 416, 195 420"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Lower lip + chin */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'10.5s','--bg-op':0.10}}
          d="M 175 440 C 195 458, 230 462, 260 450 C 280 440, 295 418, 310 400"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Jaw line continuing off-screen */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'8s','--bg-op':0.08}}
          d="M 310 400 C 360 350, 420 320, 480 340 C 540 360, 560 420, 520 480"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Neck column */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'12s','--bg-op':0.08}}
          d="M 240 470 C 245 530, 238 600, 230 680"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Ear */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'4.5s','--bg-op':0.09}}
          d="M 170 270 C 148 285, 140 320, 155 345 C 165 360, 182 355, 185 340 C 175 330, 165 310, 172 295"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE B — TOP-RIGHT QUADRANT
            Sweeping vine / tendril system that blooms from the top-right
            corner and cascades diagonally.
            ════════════════════════════════════════════════════════════════ */}

        {/* Main vine trunk */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'1s','--bg-op':0.10}}
          d="M 1480 -40 C 1400 80, 1300 180, 1180 260 C 1060 340, 920 380, 840 460 C 760 540, 750 640, 780 740"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Branch 1 */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'19s','--bg-delay':'4s','--bg-op':0.09}}
          d="M 1300 180 C 1320 140, 1360 100, 1410 80"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Branch 2 */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'17s','--bg-delay':'6s','--bg-op':0.09}}
          d="M 1180 260 C 1220 230, 1270 215, 1310 225"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Leaf cluster 1 — small oval loops */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'7s','--bg-op':0.10}}
          d="M 1300 180 C 1280 162, 1260 170, 1268 185 C 1276 200, 1300 195, 1300 180 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'8s','--bg-op':0.10}}
          d="M 1290 160 C 1275 144, 1255 152, 1263 167 C 1271 182, 1292 176, 1290 160 Z"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Leaf cluster 2 */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'15s','--bg-delay':'9s','--bg-op':0.09}}
          d="M 1060 340 C 1040 318, 1018 326, 1026 342 C 1034 358, 1062 352, 1060 340 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'15s','--bg-delay':'10s','--bg-op':0.09}}
          d="M 1040 322 C 1022 304, 1002 314, 1012 330 C 1022 346, 1042 340, 1040 322 Z"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Leaf cluster 3 — vermilion accent leaf */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'11s','--bg-op':0.15}}
          d="M 920 380 C 900 358, 878 368, 888 385 C 898 402, 922 394, 920 380 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>

        {/* Tendril curls */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'5.5s','--bg-op':0.08}}
          d="M 840 460 C 860 440, 880 430, 890 440 C 900 450, 885 465, 870 460 C 856 455, 858 445, 866 444"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'6.5s','--bg-op':0.08}}
          d="M 780 740 C 800 720, 820 710, 830 720 C 840 730, 825 745, 812 742 C 800 738, 802 728, 810 727"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Secondary vine off main trunk */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'13s','--bg-op':0.08}}
          d="M 840 460 C 900 490, 980 500, 1040 480 C 1100 460, 1150 420, 1200 400"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE C — BOTTOM-LEFT QUADRANT
            A massive hand reaching up from the bottom edge — fingers
            spread, drawn as outline studies.
            ════════════════════════════════════════════════════════════════ */}

        {/* Palm base */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'2s','--bg-op':0.11}}
          d="M 60 940 C 80 880, 100 820, 120 780 C 140 740, 180 720, 200 740 C 220 760, 215 810, 200 850"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Thumb */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'5s','--bg-op':0.10}}
          d="M 120 780 C 90 750, 62 730, 50 700 C 40 675, 55 658, 75 665 C 95 672, 110 695, 118 720"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Index finger */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'7s','--bg-op':0.10}}
          d="M 200 740 C 210 700, 215 650, 210 610 C 208 590, 195 575, 182 582 C 169 590, 167 610, 172 640"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Middle finger */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'21s','--bg-delay':'8.5s','--bg-op':0.10}}
          d="M 220 735 C 235 690, 244 634, 238 590 C 234 566, 220 552, 205 560 C 192 568, 190 590, 194 620"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Ring finger */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'19s','--bg-delay':'10s','--bg-op':0.09}}
          d="M 240 748 C 255 710, 264 664, 258 628 C 254 608, 240 597, 228 606 C 216 615, 215 638, 220 662"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Pinky */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'17s','--bg-delay':'11.5s','--bg-op':0.09}}
          d="M 258 762 C 272 732, 278 698, 272 672 C 268 655, 255 648, 244 656 C 234 664, 234 682, 238 700"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Knuckle wrinkle lines */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'13s','--bg-op':0.07}}
          d="M 186 660 C 194 656, 202 658, 206 664 M 208 702 C 216 698, 224 700, 228 706 M 228 674 C 236 670, 244 672, 248 678 M 246 714 C 254 710, 262 712, 266 718"
          stroke="#14110f" strokeWidth="1.4" strokeLinecap="round"/>

        {/* Pencil in hand (index+thumb grip) — vermilion accent */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'6s','--bg-op':0.15}}
          d="M 140 680 L 198 584"
          stroke="#e8441e" strokeWidth="2.5" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'6.4s','--bg-op':0.13}}
          d="M 196 584 L 192 576 L 200 582 Z"
          stroke="#e8441e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE D — BOTTOM-RIGHT QUADRANT
            Large scrawled abstract letterforms / calligraphic gestures that
            don't resolve into real words — just the energy of writing.
            ════════════════════════════════════════════════════════════════ */}

        {/* Giant sweeping baseline arc */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'25s','--bg-delay':'3s','--bg-op':0.09}}
          d="M 900 920 C 1000 860, 1120 820, 1240 840 C 1360 860, 1440 900, 1500 860"
          stroke="#14110f" strokeWidth="2.5" strokeLinecap="round"/>

        {/* Scrawl stroke 1 — big looping "O-ish" form */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'20s','--bg-delay':'5s','--bg-op':0.09}}
          d="M 950 780 C 970 740, 1010 720, 1060 730 C 1110 740, 1130 775, 1120 810 C 1110 845, 1075 860, 1038 850 C 1002 840, 980 815, 990 790"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>

        {/* Scrawl stroke 2 — slanted "N-ish" thrust */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'17s','--bg-delay':'8s','--bg-op':0.09}}
          d="M 1160 700 V 800 L 1220 700 V 800"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Scrawl stroke 3 — wild ascending gesture */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'15s','--bg-delay':'10s','--bg-op':0.08}}
          d="M 1280 820 C 1310 790, 1340 750, 1360 700 C 1380 650, 1370 610, 1340 600"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>

        {/* Vermilion underline / emphasis slash */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'9s','--bg-op':0.15}}
          d="M 940 830 C 990 822, 1060 828, 1120 820"
          stroke="#e8441e" strokeWidth="3" strokeLinecap="round"/>

        {/* Ink splatter blobs — small circle sketches */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'7s','--bg-op':0.13}}
          d="M 1310 870 A 5 5 0 1 1 1310 869.9 Z"
          stroke="#e8441e" strokeWidth="2.5" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'7.8s','--bg-op':0.10}}
          d="M 1330 858 A 3 3 0 1 1 1330 857.9 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'8.4s','--bg-op':0.09}}
          d="M 1348 875 A 4 4 0 1 1 1348 874.9 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE E — CENTRE BAND
            Light, airy horizontal scribble-lines that feel like faint
            blue-line ruled paper behind the content. Very low opacity.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'0s','--bg-op':0.055}}
          d="M 0 310 C 240 302, 480 318, 720 308 C 960 298, 1200 314, 1440 306"
          stroke="#14110f" strokeWidth="1.2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'4s','--bg-op':0.045}}
          d="M 0 370 C 260 362, 520 378, 780 368 C 1040 358, 1240 374, 1440 366"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'8s','--bg-op':0.045}}
          d="M 0 430 C 200 422, 440 438, 680 428 C 920 418, 1160 434, 1440 426"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'12s','--bg-op':0.040}}
          d="M 0 490 C 280 482, 560 498, 840 488 C 1120 478, 1320 494, 1440 486"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'28s','--bg-delay':'16s','--bg-op':0.040}}
          d="M 0 550 C 220 542, 460 558, 700 548 C 940 538, 1200 554, 1440 546"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE F — SCATTERED GEOMETRIC / EDITORIAL MARKS
            Tiny asterisks, registration crosses, and loop glyphs that feel
            like a sketchbook margin full of thinking-marks. These use the
            fastest cycles so the page always has micro-activity.
            ════════════════════════════════════════════════════════════════ */}

        {/* Top-centre asterisk cluster */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'9s','--bg-delay':'0s','--bg-op':0.10}}
          d="M 700 60 V 90 M 685 75 H 715 M 688 63 L 712 87 M 712 63 L 688 87"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'9s','--bg-delay':'2s','--bg-op':0.08}}
          d="M 760 40 V 64 M 748 52 H 772 M 750 42 L 770 62 M 770 42 L 750 62"
          stroke="#14110f" strokeWidth="1.5" strokeLinecap="round"/>

        {/* Mid-left cross mark */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'11s','--bg-delay':'3s','--bg-op':0.09}}
          d="M 50 450 V 490 M 30 470 H 70"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Mid-right diamond */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'5s','--bg-op':0.09}}
          d="M 1390 400 L 1410 425 L 1390 450 L 1370 425 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Vermilion registration cross — upper-right */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'4s','--bg-op':0.14}}
          d="M 1380 80 V 120 M 1360 100 H 1400"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'10s','--bg-delay':'5s','--bg-op':0.12}}
          d="M 1370 90 L 1390 110 M 1390 90 L 1370 110"
          stroke="#e8441e" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Lower-left small loop */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'12s','--bg-delay':'6s','--bg-op':0.09}}
          d="M 380 820 C 395 800, 420 798, 430 812 C 440 826, 430 845, 412 848 C 394 851, 380 838, 380 820 Z"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Centre-right small loop — vermilion */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'11s','--bg-delay':'10s','--bg-op':0.13}}
          d="M 1100 200 C 1115 182, 1140 180, 1150 194 C 1160 208, 1150 226, 1133 229 C 1116 232, 1102 220, 1100 200 Z"
          stroke="#e8441e" strokeWidth="2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE G — ABSTRACT BIRD / SWALLOW FLOCK
            Quick M-shaped wing silhouettes scattered across the upper half,
            varying in size to convey depth.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'2s','--bg-op':0.10}}
          d="M 520 80 C 535 68, 554 72, 564 85 C 574 72, 593 67, 608 80"
          stroke="#14110f" strokeWidth="2.2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'14s','--bg-delay':'2.5s','--bg-op':0.08}}
          d="M 564 85 L 563 96"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'4s','--bg-op':0.09}}
          d="M 590 120 C 601 111, 614 114, 621 124 C 628 114, 641 110, 652 120"
          stroke="#14110f" strokeWidth="2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'16s','--bg-delay':'4.4s','--bg-op':0.07}}
          d="M 621 124 L 620 132"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'18s','--bg-delay':'6s','--bg-op':0.08}}
          d="M 660 55 C 668 47, 677 50, 682 58 C 687 50, 696 46, 704 55"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* Tiny distant birds */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'8s','--bg-op':0.07}}
          d="M 820 35 Q 828 28, 836 35 Q 844 28, 852 35"
          stroke="#14110f" strokeWidth="1.4" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'13s','--bg-delay':'9s','--bg-op':0.06}}
          d="M 870 50 Q 876 44, 882 50 Q 888 44, 894 50"
          stroke="#14110f" strokeWidth="1.2" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE H — LARGE SPIRAL / SCRIBBLE MASS (far-right mid-zone)
            A loosening spiral that looks like a pen testing pressure,
            the classic gesture every artist makes on a fresh page.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'14s','--bg-op':0.08}}
          d="M 1340 540
             C 1355 530, 1370 535, 1372 550
             C 1374 565, 1362 578, 1347 578
             C 1332 578, 1320 565, 1322 550
             C 1324 535, 1337 524, 1352 526
             C 1367 528, 1380 542, 1378 557
             C 1376 572, 1362 583, 1346 580"
          stroke="#14110f" strokeWidth="1.8" strokeLinecap="round"/>

        {/* Extended tail of the spiral */}
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'22s','--bg-delay':'15.5s','--bg-op':0.07}}
          d="M 1346 580 C 1340 585, 1334 586, 1330 582 C 1320 574, 1318 560, 1326 550"
          stroke="#14110f" strokeWidth="1.6" strokeLinecap="round"/>

        {/* ════════════════════════════════════════════════════════════════
            ZONE I — LONG DIAGONAL HATCHING (centre-left shadow mass)
            Parallel angled lines, like a shading pass over a form.
            Very faint — purely textural.
            ════════════════════════════════════════════════════════════════ */}

        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'0s','--bg-op':0.055}}
          d="M 350 580 L 480 700"
          stroke="#14110f" strokeWidth="1.2" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'1s','--bg-op':0.050}}
          d="M 370 558 L 510 688"
          stroke="#14110f" strokeWidth="1.1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'2s','--bg-op':0.045}}
          d="M 390 540 L 540 678"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'3s','--bg-op':0.040}}
          d="M 412 524 L 568 668"
          stroke="#14110f" strokeWidth="1" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'4s','--bg-op':0.036}}
          d="M 436 510 L 598 658"
          stroke="#14110f" strokeWidth="0.9" strokeLinecap="round"/>
        <path className="bg-sk" pathLength="1"
          style={{'--bg-cycle':'26s','--bg-delay':'5s','--bg-op':0.032}}
          d="M 462 498 L 630 650"
          stroke="#14110f" strokeWidth="0.9" strokeLinecap="round"/>

      </svg>
    </>
  )
}
