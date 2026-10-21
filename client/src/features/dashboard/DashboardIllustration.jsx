function Stroke({
  d,
  cycle = '14s',
  delay = '0s',
  accent = false,
  width = 2,
  faint = false,
  opacity,
  className = '',
}) {
  return (
    <path
      d={d}
      pathLength="1"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`dash-stroke ${accent ? 'dash-accent' : faint ? 'dash-faint' : 'dash-ink'} ${className}`}
      style={{
        '--cycle': cycle,
        '--delay': delay,
        strokeWidth: width,
        ...(opacity !== undefined ? { '--max-op': opacity } : {}),
      }}
    />
  )
}

export default function DashboardIllustration() {
  return (
    <figure
      aria-hidden="true"
      className="pointer-events-none relative mx-auto w-full max-w-[36rem] select-none lg:max-w-none"
    >
      <style>{`
        @keyframes dashboardSketchDraw {
          0% {
            stroke-dashoffset: 1;
            opacity: 0;
          }
          5% {
            stroke-dashoffset: 1;
            opacity: var(--max-op, 1);
          }
          30% {
            stroke-dashoffset: 0;
            opacity: var(--max-op, 1);
          }
          70% {
            stroke-dashoffset: 0;
            opacity: var(--max-op, 1);
          }
          85% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: 1;
            opacity: 0;
          }
        }

        .dash-stroke {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: dashboardSketchDraw var(--cycle, 14s) ease-in-out infinite;
          animation-delay: var(--delay, 0s);
          will-change: stroke-dashoffset, opacity;
        }

        .dash-ink {
          stroke: rgba(20, 17, 15, 0.22);
          stroke: color-mix(in srgb, var(--color-ink, #14110f) 22%, transparent);
        }

        .dash-faint {
          stroke: rgba(20, 17, 15, 0.13);
          stroke: color-mix(in srgb, var(--color-ink, #14110f) 13%, transparent);
        }

        .dash-accent {
          stroke: rgba(232, 68, 30, 0.38);
          stroke: color-mix(in srgb, var(--color-vermilion, #e8441e) 38%, transparent);
        }

        @media (prefers-reduced-motion: reduce) {
          .dash-stroke {
            animation: none !important;
            stroke-dashoffset: 0 !important;
            opacity: var(--max-op, 1) !important;
          }
        }
      `}</style>

      {/* SVG canvas: 760x480 golden sketchbook ratio */}
      <svg
        viewBox="0 0 760 480"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className="block h-auto w-full overflow-visible"
      >
        {/* ========================================================
            LAYER 1: DESK HORIZON & SKETCHBOOK PHYSICAL FOUNDATIONS
            ======================================================== */}
        {/* Horizon / Desk edge */}
        <Stroke
          d="M 28 442 L 732 442"
          cycle="22s"
          delay="0s"
          faint
          width={1.5}
        />

        {/* Outer hardcover depth / stacked page leaves */}
        <Stroke
          d="M 124 64 L 128 428 L 370 435"
          cycle="20s"
          delay="0.6s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 626 64 L 622 428 L 370 435"
          cycle="20s"
          delay="0.9s"
          faint
          width={1.5}
        />

        {/* Left page contour */}
        <Stroke
          d="M 370 52 C 290 44, 210 48, 130 58 C 128 178, 126 300, 132 424 C 210 418, 290 424, 370 432"
          cycle="18s"
          delay="1.2s"
          width={2.5}
        />

        {/* Right page contour */}
        <Stroke
          d="M 370 52 C 450 44, 530 48, 618 58 C 620 178, 622 300, 616 424 C 530 418, 450 424, 370 432"
          cycle="18s"
          delay="1.5s"
          width={2.5}
        />

        {/* Center book spine seam */}
        <Stroke d="M 370 50 V 434" cycle="19s" delay="1.8s" width={2} />

        {/* Stitching thread loops binding the spine */}
        <Stroke
          d="M 363 85 C 370 79, 377 79, 377 85 C 377 91, 363 91, 363 85"
          cycle="16s"
          delay="2.1s"
          width={2}
        />
        <Stroke
          d="M 363 140 C 370 134, 377 134, 377 140 C 377 146, 363 146, 363 140"
          cycle="16s"
          delay="2.4s"
          width={2}
        />
        <Stroke
          d="M 363 195 C 370 189, 377 189, 377 195 C 377 201, 363 201, 363 195"
          cycle="16s"
          delay="2.7s"
          width={2}
        />
        <Stroke
          d="M 363 250 C 370 244, 377 244, 377 250 C 377 256, 363 256, 363 250"
          cycle="16s"
          delay="3.0s"
          width={2}
        />
        <Stroke
          d="M 363 305 C 370 299, 377 299, 377 305 C 377 311, 363 311, 363 305"
          cycle="16s"
          delay="3.3s"
          width={2}
        />
        <Stroke
          d="M 363 360 C 370 354, 377 354, 377 360 C 377 366, 363 366, 363 360"
          cycle="16s"
          delay="3.6s"
          width={2}
        />
        <Stroke
          d="M 363 415 C 370 409, 377 409, 377 415 C 377 421, 363 421, 363 415"
          cycle="16s"
          delay="3.9s"
          width={2}
        />

        {/* Top-right dog-ear page curl */}
        <Stroke
          d="M 590 57 L 618 85"
          cycle="17s"
          delay="2.3s"
          width={1.8}
        />
        <Stroke
          d="M 590 57 L 598 80 L 618 85"
          cycle="17s"
          delay="2.6s"
          width={1.8}
        />

        {/* ========================================================
            LAYER 2: STILL-LIFE TOOLS SCATTERED ACROSS DESK
            ======================================================== */}
        {/* Desk Ruler along bottom */}
        <Stroke
          d="M 180 448 L 560 448"
          cycle="21s"
          delay="1.0s"
          width={1.5}
        />
        <Stroke
          d="M 180 462 L 560 462"
          cycle="21s"
          delay="1.4s"
          width={1.5}
        />
        <Stroke
          d="M 220 448 V 455 M 260 448 V 455 M 300 448 V 455 M 340 448 V 455 M 380 448 V 455 M 420 448 V 455 M 460 448 V 455 M 500 448 V 455 M 540 448 V 455"
          cycle="19s"
          delay="2.0s"
          width={1.4}
        />
        <Stroke
          d="M 200 448 V 452 M 240 448 V 452 M 280 448 V 452 M 320 448 V 452 M 360 448 V 452 M 400 448 V 452 M 440 448 V 452 M 480 448 V 452 M 520 448 V 452"
          cycle="19s"
          delay="2.5s"
          faint
          width={1}
        />

        {/* Antique Glass Inkwell (Bottom Left) */}
        <Stroke
          d="M 52 440 L 126 440 L 132 385 L 116 352 L 62 352 L 46 385 Z"
          cycle="17s"
          delay="1.7s"
          width={2.4}
        />
        <Stroke
          d="M 74 352 V 334 H 104 V 352"
          cycle="17s"
          delay="2.1s"
          width={2}
        />
        <Stroke
          d="M 68 334 C 68 328, 110 328, 110 334 C 110 340, 68 340, 68 334 Z"
          cycle="17s"
          delay="2.5s"
          width={2}
        />
        <Stroke
          d="M 72 352 L 66 385 L 70 440 M 106 352 L 112 385 L 108 440"
          cycle="16s"
          delay="2.9s"
          faint
          width={1.4}
        />
        <Stroke
          d="M 52 396 C 76 390, 102 402, 126 396"
          cycle="15s"
          delay="3.3s"
          width={2}
        />
        <Stroke
          d="M 72 376 H 106 V 420 H 72 Z"
          cycle="16s"
          delay="3.7s"
          width={1.5}
        />
        <Stroke
          d="M 80 388 V 404 M 86 388 V 404 L 94 388 V 404 M 98 388 V 404"
          cycle="16s"
          delay="4.1s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 32 440 L 42 414 L 48 416 L 40 442 Z"
          cycle="17s"
          delay="4.5s"
          faint
          width={1.5}
        />

        {/* Dip Pen with pointed steel nib */}
        <Stroke
          d="M 20 275 L 78 328 L 76 331 L 18 278 Z"
          cycle="16s"
          delay="2.6s"
          width={2}
        />
        <Stroke
          d="M 78 328 L 94 342 L 91 344 L 76 331 Z"
          cycle="15s"
          delay="3.1s"
          width={2}
        />
        <Stroke
          d="M 94 342 L 85 334"
          cycle="15s"
          delay="3.5s"
          accent
          width={1.6}
        />

        {/* Brass Drafting Compass / Calipers (Top Left) */}
        <Stroke
          d="M 88 62 C 88 56, 98 56, 98 62 C 98 68, 88 68, 88 62 Z M 93 56 V 46"
          cycle="18s"
          delay="2.0s"
          width={2}
        />
        <Stroke
          d="M 90 66 L 62 152"
          cycle="18s"
          delay="2.4s"
          width={2}
        />
        <Stroke
          d="M 96 66 L 128 146"
          cycle="18s"
          delay="2.8s"
          width={2}
        />
        <Stroke
          d="M 126 138 L 134 160 L 129 162 L 122 140 Z"
          cycle="17s"
          delay="3.2s"
          faint
          width={1.4}
        />
        <Stroke
          d="M 76 102 C 92 106, 110 105, 116 97"
          cycle="17s"
          delay="3.6s"
          faint
          width={1.4}
        />

        {/* 2B Drafting Pencil & Shavings (Right Margin) */}
        <Stroke
          d="M 692 88 L 732 248 L 724 250 L 684 90 Z"
          cycle="19s"
          delay="1.9s"
          width={2}
        />
        <Stroke
          d="M 688 89 L 728 249"
          cycle="19s"
          delay="2.3s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 732 248 L 724 250 L 728 268 Z"
          cycle="18s"
          delay="2.7s"
          width={2}
        />
        <Stroke
          d="M 726 260 L 730 259 L 728 268 Z"
          cycle="18s"
          delay="3.1s"
          width={2}
        />
        <Stroke
          d="M 656 292 C 638 280, 636 312, 658 320 C 674 324, 682 305, 668 296 C 656 288, 644 300, 652 310"
          cycle="15s"
          delay="3.8s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 658 296 C 646 292, 644 306, 656 312"
          cycle="15s"
          delay="4.2s"
          faint
          width={1.2}
        />

        {/* ========================================================
            LAYER 3: LEFT PAGE — THE PROMPT CARD & STUDY VIGNETTES
            ======================================================== */}
        {/* Masking tape strip pinning prompt card */}
        <Stroke
          d="M 226 78 L 278 76 L 277 90 L 225 92 Z"
          cycle="16s"
          delay="2.8s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 238 79 L 237 91 M 266 77 L 265 89"
          cycle="16s"
          delay="3.2s"
          faint
          width={1}
        />

        {/* Prompt Card Frame */}
        <Stroke
          d="M 162 94 L 342 84 L 348 214 L 168 224 Z"
          cycle="15s"
          delay="3.5s"
          width={2.4}
        />
        <Stroke
          d="M 170 100 L 336 90"
          cycle="15s"
          delay="3.9s"
          faint
          width={1.2}
        />

        {/* Header eyebrow & text on prompt card */}
        <Stroke
          d="M 176 114 H 236"
          cycle="15s"
          delay="4.2s"
          width={1.5}
        />
        {/* Lettering for "PROMPT • ROUND 03" */}
        <Stroke
          d="M 176 126 H 183 M 179 126 V 134 M 187 126 V 134 M 187 126 H 193 C 195 126, 195 129, 193 129 H 187 M 191 129 L 194 134 M 199 126 C 203 126, 204 130, 204 130 C 204 130, 203 134, 199 134 C 195 134, 194 130, 194 130 C 194 130, 195 126, 199 126 Z"
          cycle="15s"
          delay="4.5s"
          faint
          width={1.2}
        />

        {/* Main Prompt Title: "A QUIET STORM" */}
        <Stroke
          d="M 176 154 L 182 140 L 188 154 M 178 150 H 186 M 198 147 C 198 142, 206 142, 206 147 C 206 152, 198 152, 198 147 Z M 204 150 L 208 154 M 213 141 V 151 C 213 154, 222 154, 222 151 V 141 M 227 141 V 153 M 227 141 H 234 M 227 147 H 232 M 227 153 H 234 M 239 141 H 245 M 242 141 V 153 M 239 153 H 245 M 249 141 H 257 M 253 141 V 153 M 265 143 C 263 141, 260 142, 260 145 C 260 149, 266 147, 266 151 C 266 154, 262 154, 259 152 M 270 141 H 278 M 274 141 V 153 M 282 141 V 153 M 282 141 H 288 C 291 141, 291 147, 288 147 H 282 M 287 147 L 291 153 M 298 147 C 298 142, 306 142, 306 147 C 306 152, 298 152, 298 147 Z M 311 153 V 141 L 316 149 L 321 141 V 153"
          cycle="14s"
          delay="4.7s"
          width={1.8}
        />

        {/* Subtitle cursive script: "inside a teacup" */}
        <Stroke
          d="M 178 174 C 188 168, 200 176, 212 170 C 224 166, 236 174, 248 168 C 260 164, 272 172, 284 168 C 296 165, 308 172, 320 168"
          cycle="14s"
          delay="5.1s"
          width={1.8}
        />
        <Stroke
          d="M 176 195 L 338 185"
          cycle="15s"
          delay="5.4s"
          faint
          width={1}
        />

        {/* Vermilion Favorite Seal on Prompt Card */}
        <Stroke
          d="M 324 170 C 334 162, 342 176, 334 186 C 324 192, 316 178, 324 170 Z"
          cycle="13s"
          delay="5.6s"
          accent
          width={2.2}
        />
        <Stroke
          d="M 322 178 L 327 182 L 335 172"
          cycle="13s"
          delay="6.0s"
          accent
          width={2}
        />

        {/* Study Vignette 1: The Teacup & Storm Cloud */}
        <Stroke
          d="M 205 320 C 240 330, 275 330, 310 320"
          cycle="14s"
          delay="4.6s"
          width={2}
        />
        <Stroke
          d="M 218 286 C 222 312, 246 320, 257 320 C 268 320, 292 312, 296 286"
          cycle="14s"
          delay="5.0s"
          width={2}
        />
        <Stroke
          d="M 218 286 C 238 292, 276 292, 296 286"
          cycle="14s"
          delay="5.3s"
          width={1.8}
        />
        <Stroke
          d="M 296 290 C 310 292, 311 308, 295 311"
          cycle="14s"
          delay="5.6s"
          width={1.8}
        />
        <Stroke
          d="M 224 289 C 242 295, 272 295, 290 289"
          cycle="14s"
          delay="5.9s"
          faint
          width={1.4}
        />

        {/* Billowing storm cloud rising from tea */}
        <Stroke
          d="M 232 272 C 222 262, 226 246, 242 248 C 248 236, 268 236, 274 246 C 284 240, 296 250, 292 262 C 300 270, 294 278, 282 277 C 272 279, 242 279, 232 272 Z"
          cycle="13s"
          delay="6.3s"
          width={2.2}
        />

        {/* Vermilion Lightning Bolt */}
        <Stroke
          d="M 260 254 L 255 266 H 262 L 256 278"
          cycle="11s"
          delay="6.7s"
          accent
          width={2.2}
        />

        {/* Rain Hatching */}
        <Stroke
          d="M 238 276 L 235 287 M 248 275 L 245 289 M 268 275 L 265 289 M 278 276 L 275 287"
          cycle="12s"
          delay="7.1s"
          faint
          width={1.2}
        />

        {/* Study Vignette 2: Crescent Moon & Script Notes */}
        <Stroke
          d="M 198 375 C 214 362, 214 395, 198 382 C 204 382, 206 375, 198 375 Z"
          cycle="14s"
          delay="6.6s"
          width={1.8}
        />
        <Stroke
          d="M 222 368 V 380 M 216 374 H 228"
          cycle="12s"
          delay="7.0s"
          accent
          width={1.5}
        />
        <Stroke
          d="M 242 374 C 256 371, 270 376, 284 372 C 298 369, 308 375, 318 372 M 242 387 C 254 384, 268 389, 280 385 C 292 382, 304 387, 314 384"
          cycle="13s"
          delay="7.4s"
          faint
          width={1.2}
        />

        {/* ========================================================
            LAYER 4: RIGHT PAGE — THE MASTERPIECE (PORTRAIT & HAND)
            ======================================================== */}
        {/* Forehead to nose bridge */}
        <Stroke
          d="M 466 142 C 461 154, 458 166, 452 176"
          cycle="14s"
          delay="2.8s"
          width={2.5}
        />
        {/* Nose tip & philtrum */}
        <Stroke
          d="M 452 176 C 447 184, 440 191, 436 193 C 444 195, 447 199, 443 204"
          cycle="14s"
          delay="3.2s"
          width={2.5}
        />
        {/* Lips */}
        <Stroke
          d="M 443 204 C 445 208, 442 213, 446 217 C 451 222, 444 226, 440 227"
          cycle="14s"
          delay="3.6s"
          width={2.5}
        />
        {/* Chin & Jawline */}
        <Stroke
          d="M 440 227 C 447 235, 458 237, 468 234 C 485 228, 498 214, 506 195"
          cycle="14s"
          delay="4.0s"
          width={2.5}
        />
        {/* Neckline front */}
        <Stroke
          d="M 464 237 C 466 260, 464 285, 458 310"
          cycle="14s"
          delay="4.4s"
          width={2}
        />
        {/* Neckline back / shoulder */}
        <Stroke
          d="M 506 215 C 516 245, 532 278, 556 315"
          cycle="14s"
          delay="4.8s"
          width={2}
        />

        {/* Expressive Eye & Brow */}
        <Stroke
          d="M 452 172 C 458 168, 468 170, 474 175"
          cycle="13s"
          delay="3.4s"
          width={2.2}
        />
        <Stroke
          d="M 454 175 C 460 178, 468 178, 472 175"
          cycle="13s"
          delay="3.8s"
          width={1.8}
        />
        <Stroke
          d="M 460 171 C 464 171, 467 174, 466 177 C 464 179, 460 178, 460 171 Z"
          cycle="13s"
          delay="4.2s"
          width={2}
        />
        {/* Vermilion Iris Accent */}
        <Stroke
          d="M 463 173 A 1.5 1.5 0 1 1 463 175 A 1.5 1.5 0 1 1 463 173 Z"
          cycle="11s"
          delay="4.5s"
          accent
          width={2}
        />
        <Stroke
          d="M 448 162 C 456 157, 468 158, 476 164"
          cycle="14s"
          delay="3.0s"
          width={2.2}
        />

        {/* Cheekbone & Jaw Hatching */}
        <Stroke
          d="M 460 190 C 472 195, 482 188, 490 182"
          cycle="13s"
          delay="4.6s"
          faint
          width={1.4}
        />
        <Stroke
          d="M 468 232 L 476 224 M 473 234 L 481 226 M 478 236 L 486 228 M 483 236 L 491 228 M 488 234 L 496 226"
          cycle="12s"
          delay="5.2s"
          faint
          width={1.2}
        />

        {/* Hair Waves Morphing Into The Universe */}
        <Stroke
          d="M 466 142 C 473 120, 503 106, 528 113 C 556 121, 566 146, 563 171"
          cycle="13s"
          delay="4.2s"
          width={2.2}
        />
        <Stroke
          d="M 478 128 C 496 110, 526 102, 549 116 C 571 130, 575 165, 559 190"
          cycle="13s"
          delay="4.7s"
          width={2}
        />
        <Stroke
          d="M 528 113 C 546 93, 576 97, 585 123 C 591 143, 581 169, 566 189"
          cycle="13s"
          delay="5.1s"
          width={2}
        />
        <Stroke
          d="M 563 171 C 561 211, 576 249, 569 291"
          cycle="13s"
          delay="5.5s"
          width={2}
        />
        <Stroke
          d="M 559 190 C 553 230, 563 265, 583 295"
          cycle="13s"
          delay="5.9s"
          width={1.8}
        />

        {/* Escaping Swallows / Living Ink Birds */}
        {/* Bird 1: Vermilion Soaring Bird */}
        <Stroke
          d="M 537 79 C 546 77, 559 81, 566 94 C 573 79, 586 74, 596 75"
          cycle="11s"
          delay="6.2s"
          accent
          width={2.5}
        />
        <Stroke
          d="M 566 94 L 569 105 L 564 102 L 561 105 Z"
          cycle="11s"
          delay="6.5s"
          accent
          width={2}
        />
        {/* Bird 2 */}
        <Stroke
          d="M 532 64 Q 544 51, 556 61 Q 568 51, 580 63"
          cycle="12s"
          delay="6.8s"
          width={2}
        />
        <Stroke
          d="M 556 61 L 555 71"
          cycle="12s"
          delay="7.1s"
          width={1.8}
        />
        {/* Bird 3 (Distant) */}
        <Stroke
          d="M 506 51 Q 513 43, 521 49 Q 529 43, 536 51"
          cycle="13s"
          delay="7.4s"
          faint
          width={1.5}
        />

        {/* Botanical Leaves in Hair */}
        <Stroke
          d="M 549 116 C 561 110, 571 102, 576 88"
          cycle="13s"
          delay="5.8s"
          width={1.5}
        />
        <Stroke
          d="M 563 107 C 565 99, 573 99, 571 107 C 569 111, 563 111, 563 107 Z"
          cycle="13s"
          delay="6.2s"
          width={1.5}
        />
        <Stroke
          d="M 573 95 C 577 89, 585 91, 583 97 C 579 101, 573 99, 573 95 Z"
          cycle="13s"
          delay="6.5s"
          width={1.5}
        />

        {/* Celestial Crescent & Constellation Starfield */}
        <Stroke
          d="M 515 130 C 528 122, 528 144, 515 138 C 522 138, 522 130, 515 130 Z"
          cycle="14s"
          delay="5.4s"
          width={1.8}
        />
        <Stroke
          d="M 538 142 L 552 135 L 562 150 M 552 135 L 545 155"
          cycle="14s"
          delay="5.8s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 538 138 V 146 M 534 142 H 542"
          cycle="12s"
          delay="6.2s"
          accent
          width={1.5}
        />
        <Stroke
          d="M 562 146 V 154 M 558 150 H 566"
          cycle="12s"
          delay="6.6s"
          accent
          width={1.5}
        />

        {/* The Artist's Hand & Pencil Actively Drawing */}
        {/* Pencil lead touching portrait jaw */}
        <Stroke
          d="M 468 234 L 472 237 L 474 235 Z"
          cycle="13s"
          delay="3.8s"
          accent
          width={2.2}
        />
        <Stroke
          d="M 468 234 L 480 242 L 485 237 Z"
          cycle="13s"
          delay="4.2s"
          width={2}
        />
        <Stroke
          d="M 480 242 L 528 274 L 533 268 L 485 237 Z"
          cycle="13s"
          delay="4.5s"
          width={2}
        />
        <Stroke
          d="M 482 239 L 530 271"
          cycle="13s"
          delay="4.8s"
          faint
          width={1.2}
        />

        {/* Hand Anatomical Study */}
        <Stroke
          d="M 495 252 C 498 247, 505 248, 508 255 C 516 248, 526 254, 532 264"
          cycle="13s"
          delay="5.1s"
          width={2.2}
        />
        <Stroke
          d="M 497 250 C 500 248, 504 250, 505 253"
          cycle="13s"
          delay="5.4s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 485 262 C 488 258, 494 260, 495 266 C 502 264, 510 270, 512 278"
          cycle="13s"
          delay="5.7s"
          width={2.2}
        />
        <Stroke
          d="M 532 264 C 545 276, 558 294, 566 314"
          cycle="13s"
          delay="6.0s"
          width={2.2}
        />
        <Stroke
          d="M 566 314 L 582 346 M 542 324 L 558 356 M 556 354 C 568 350, 578 346, 584 344"
          cycle="13s"
          delay="6.4s"
          width={2}
        />

        {/* ========================================================
            LAYER 5: MASTER VERMILION INK RIVER & SPLATTERS
            ======================================================== */}
        {/* Main calligraphic ink swirl ribbon */}
        <Stroke
          d="M 116 392 C 160 380, 240 435, 340 428 C 420 422, 500 442, 610 420 C 660 410, 690 385, 680 355 C 670 330, 640 338, 642 360 C 644 380, 672 388, 700 375"
          cycle="12s"
          delay="3.5s"
          accent
          width={3.2}
        />
        <Stroke
          d="M 124 398 C 170 388, 245 440, 342 433 C 422 427, 498 447, 608 426"
          cycle="12s"
          delay="4.0s"
          accent
          width={1.6}
        />

        {/* Vermilion ink splatter droplets */}
        <Stroke
          d="M 138 381 A 2.2 2.2 0 1 1 138 385.4 A 2.2 2.2 0 1 1 138 381 Z"
          cycle="11s"
          delay="4.8s"
          accent
          width={2.2}
        />
        <Stroke
          d="M 150 397 A 1.8 1.8 0 1 1 150 400.6 A 1.8 1.8 0 1 1 150 397 Z"
          cycle="11s"
          delay="5.3s"
          accent
          width={1.8}
        />
        <Stroke
          d="M 282 432 A 2 2 0 1 1 282 436 A 2 2 0 1 1 282 432 Z"
          cycle="12s"
          delay="5.8s"
          accent
          width={2}
        />
        <Stroke
          d="M 482 438 A 1.6 1.6 0 1 1 482 441.2 A 1.6 1.6 0 1 1 482 438 Z"
          cycle="12s"
          delay="6.3s"
          accent
          width={1.6}
        />
        <Stroke
          d="M 688 347 A 2 2 0 1 1 688 351 A 2 2 0 1 1 688 347 Z"
          cycle="10s"
          delay="6.7s"
          accent
          width={2}
        />
        <Stroke
          d="M 698 381 A 1.6 1.6 0 1 1 698 384.2 A 1.6 1.6 0 1 1 698 381 Z"
          cycle="10s"
          delay="7.1s"
          accent
          width={1.6}
        />

        {/* Editorial Notation Arrow & Notes */}
        <Stroke
          d="M 618 200 C 625 210, 615 225, 602 228 M 602 228 L 608 223 M 602 228 L 609 233"
          cycle="14s"
          delay="7.0s"
          faint
          width={1.5}
        />
        <Stroke
          d="M 618 194 C 624 192, 630 196, 636 193 C 642 190, 648 194, 654 192"
          cycle="14s"
          delay="7.4s"
          faint
          width={1.2}
        />

        {/* Editorial Registration Marks */}
        <Stroke
          d="M 148 68 H 160 M 154 62 V 74"
          cycle="18s"
          delay="1.0s"
          faint
          width={1.2}
        />
        <Stroke
          d="M 590 412 H 602 M 596 406 V 418"
          cycle="18s"
          delay="1.5s"
          faint
          width={1.2}
        />
      </svg>
    </figure>
  )
}
