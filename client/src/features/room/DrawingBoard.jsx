// DrawingBoard: toolbar + canvas. Presentational: every behaviour comes from
// useDrawingBoard(), which the parent owns so it can read hasInk and export.

import { Eraser, Pencil, Trash2, Undo2 } from 'lucide-react'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  MAX_SIZE,
  MIN_SIZE,
  PALETTE,
  PAPER_COLOR,
} from './useDrawingBoard.js'

const toolButton =
  'inline-flex items-center gap-2 rounded-control border-2 border-ink px-3 py-2 text-sm font-semibold ' +
  'disabled:pointer-events-none disabled:opacity-40'

export default function DrawingBoard({ board, disabled }) {
  const { tool, setTool, color, pickColor, size, setSize } = board

  return (
    <div onKeyDown={board.handleKeyDown} className="space-y-3">
      <fieldset disabled={disabled} className="min-w-0 border-2 border-ink bg-sheet p-3 disabled:opacity-60">
        <legend className="sr-only">Drawing tools</legend>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {/* Tool */}
          <div className="flex gap-2" role="group" aria-label="Tool">
            <button
              type="button"
              aria-pressed={tool === 'brush'}
              onClick={() => setTool('brush')}
              className={`${toolButton} ${tool === 'brush' ? 'bg-ink text-paper' : 'hover:bg-paper-deep'}`}
            >
              <Pencil className="size-4" aria-hidden="true" />
              Brush
            </button>
            <button
              type="button"
              aria-pressed={tool === 'eraser'}
              onClick={() => setTool('eraser')}
              className={`${toolButton} ${tool === 'eraser' ? 'bg-ink text-paper' : 'hover:bg-paper-deep'}`}
            >
              <Eraser className="size-4" aria-hidden="true" />
              Eraser
            </button>
          </div>

          {/* Colour */}
          <div role="radiogroup" aria-label="Brush color" className="flex flex-wrap gap-1.5">
            {PALETTE.map((swatch) => {
              const selected = color === swatch.value
              return (
                <button
                  key={swatch.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={swatch.name}
                  title={swatch.name}
                  onClick={() => pickColor(swatch.value)}
                  style={{ backgroundColor: swatch.value }}
                  className={`size-8 shrink-0 ${
                    selected ? 'border-[3px] border-ink' : 'border-2 border-ink/30'
                  }`}
                />
              )
            })}
          </div>

          {/* Size */}
          <div className="flex items-center gap-3">
            <label htmlFor="brush-size" className="text-sm font-semibold">
              Size
            </label>
            <input
              id="brush-size"
              type="range"
              min={MIN_SIZE}
              max={MAX_SIZE}
              step={2}
              value={size}
              onChange={(event) => setSize(Number(event.target.value))}
              className="w-28 accent-ink sm:w-36"
            />
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center border-2 border-ink/30"
              style={{ backgroundColor: PAPER_COLOR }}
            >
              <span
                className="block"
                style={{
                  width: size,
                  height: size,
                  borderRadius: '9999px',
                  backgroundColor: tool === 'eraser' ? PAPER_COLOR : color,
                  boxShadow: tool === 'eraser' ? 'inset 0 0 0 1px #14110f' : 'none',
                }}
              />
            </span>
          </div>

          {/* History */}
          <div className="flex gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={board.undo}
              disabled={!board.canUndo}
              aria-label="Undo (Ctrl or Command Z)"
              className={`${toolButton} hover:bg-paper-deep`}
            >
              <Undo2 className="size-4" aria-hidden="true" />
              Undo
            </button>
            <button
              type="button"
              onClick={board.clear}
              disabled={!board.hasInk}
              className={`${toolButton} hover:bg-paper-deep`}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Clear
            </button>
          </div>
        </div>
      </fieldset>

      {/* The canvas is fixed at 1200×900 and scaled by CSS, 4:3 always. Its
          width is capped so the whole board fits the viewport height. */}
      <div
        className="mx-auto"
        style={{ width: 'min(100%, max(18rem, calc((100dvh - 19rem) * 4 / 3)))' }}
      >
        <canvas
          ref={board.setCanvas}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          role="img"
          aria-label="Drawing canvas. Draw with a mouse, finger or stylus."
          className={`block h-auto w-full touch-none border-2 border-ink bg-sheet ${
            disabled ? 'cursor-not-allowed' : 'cursor-crosshair'
          }`}
          {...board.pointerHandlers}
        />
      </div>
    </div>
  )
}