import { useCallback, useRef, useState } from 'react'
import { exportDrawing } from './drawingExport.js'

export const CANVAS_WIDTH = 1200
export const CANVAS_HEIGHT = 900
export const PAPER_COLOR = '#fbf7ee'
export const MIN_SIZE = 2
export const MAX_SIZE = 48

export const PALETTE = [
  { name: 'Ink', value: '#14110f' },
  { name: 'Graphite', value: '#6b6154' },
  { name: 'Vermilion', value: '#e8441e' },
  { name: 'Amber', value: '#f2a93b' },
  { name: 'Green', value: '#3f7d4e' },
  { name: 'Blue', value: '#2f6f9f' },
  { name: 'Plum', value: '#7a3b8c' },
  { name: 'Brown', value: '#8a5a3b' },
]

// ── Pure drawing helpers ─────────────────────────────────────────────────────
// A stroke is { type: 'stroke', color, size, points: [{x, y}] } in canvas
// coordinates. The eraser is a stroke painted in the paper colour. A
// { type: 'clear' } entry wipes the page, so undoing a clear brings it back.

const midpoint = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })

function paintPaper(ctx) {
  ctx.fillStyle = PAPER_COLOR
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function prepare(ctx, stroke) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = stroke.size
  ctx.strokeStyle = stroke.color
  ctx.fillStyle = stroke.color
}

function drawDot(ctx, stroke) {
  const [point] = stroke.points
  prepare(ctx, stroke)
  ctx.beginPath()
  ctx.arc(point.x, point.y, stroke.size / 2, 0, Math.PI * 2)
  ctx.fill()
}

// The curve segment produced by adding point `index` (>= 1). Segments run
// midpoint to midpoint with the previous point as the control, which smooths
// out jitter. The same function is used live and when replaying.
function drawSegment(ctx, stroke, index) {
  const points = stroke.points
  const from = index === 1 ? points[0] : midpoint(points[index - 2], points[index - 1])
  const to = midpoint(points[index - 1], points[index])
  prepare(ctx, stroke)
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.quadraticCurveTo(points[index - 1].x, points[index - 1].y, to.x, to.y)
  ctx.stroke()
}

// The final straight piece, from the last midpoint to the last point.
function drawTail(ctx, stroke) {
  const points = stroke.points
  const last = points.length - 1
  if (last < 1) return
  const from = midpoint(points[last - 1], points[last])
  prepare(ctx, stroke)
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(points[last].x, points[last].y)
  ctx.stroke()
}

function drawFullStroke(ctx, stroke) {
  if (stroke.points.length === 1) {
    drawDot(ctx, stroke)
    return
  }
  for (let index = 1; index < stroke.points.length; index += 1) drawSegment(ctx, stroke, index)
  drawTail(ctx, stroke)
}

function replay(ctx, history) {
  paintPaper(ctx)
  for (const item of history) {
    if (item.type === 'clear') paintPaper(ctx)
    else drawFullStroke(ctx, item)
  }
}

function summarize(history) {
  let ink = 0 // strokes since the last clear
  for (const item of history) ink = item.type === 'clear' ? 0 : ink + 1
  return { steps: history.length, ink }
}

// Pointer position in logical canvas coordinates, whatever size the canvas is
// currently displayed at.
function toCanvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  }
}

// ── The hook ─────────────────────────────────────────────────────────────────
export function useDrawingBoard({ disabled = false } = {}) {
  const canvasRef = useRef(null)
  const historyRef = useRef([])
  const activeRef = useRef(null) // { pointerId, stroke } while a pointer is down

  const [tool, setTool] = useState('brush') // 'brush' | 'eraser'
  const [color, setColor] = useState(PALETTE[0].value)
  const [size, setSize] = useState(8)
  const [summary, setSummary] = useState({ steps: 0, ink: 0 })

  // Callback ref: whenever the canvas element mounts, repaint it from history,
  // so the drawing survives the element being remounted.
  const setCanvas = useCallback((node) => {
    canvasRef.current = node
    if (node) replay(node.getContext('2d'), historyRef.current)
  }, [])

  const finishStroke = useCallback(() => {
    const active = activeRef.current
    if (!active) return
    activeRef.current = null
    const canvas = canvasRef.current
    if (canvas) drawTail(canvas.getContext('2d'), active.stroke)
    historyRef.current.push(active.stroke)
    setSummary(summarize(historyRef.current))
  }, [])

  const redraw = useCallback(() => {
    const canvas = canvasRef.current
    if (canvas) replay(canvas.getContext('2d'), historyRef.current)
    setSummary(summarize(historyRef.current))
  }, [])

  const undo = useCallback(() => {
    if (disabled || activeRef.current || historyRef.current.length === 0) return
    historyRef.current.pop()
    redraw()
  }, [disabled, redraw])

  const clear = useCallback(() => {
    if (disabled || activeRef.current) return
    if (summarize(historyRef.current).ink === 0) return // nothing to clear
    historyRef.current.push({ type: 'clear' })
    redraw()
  }, [disabled, redraw])

  const pickColor = useCallback((value) => {
    setColor(value)
    setTool('brush')
  }, [])

  // ── Pointer input (mouse, touch and pen share one code path) ──
  function handlePointerDown(event) {
    if (disabled || activeRef.current) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const canvas = canvasRef.current
    if (!canvas) return

    event.preventDefault()
    canvas.setPointerCapture(event.pointerId)

    const stroke = {
      type: 'stroke',
      color: tool === 'eraser' ? PAPER_COLOR : color,
      size,
      points: [toCanvasPoint(canvas, event)],
    }
    activeRef.current = { pointerId: event.pointerId, stroke }
    drawDot(canvas.getContext('2d'), stroke)
  }

  function handlePointerMove(event) {
    const active = activeRef.current
    const canvas = canvasRef.current
    if (!active || !canvas || active.pointerId !== event.pointerId) return

    const point = toCanvasPoint(canvas, event)
    const points = active.stroke.points
    const last = points[points.length - 1]
    if (Math.hypot(point.x - last.x, point.y - last.y) < 1.5) return // ignore jitter

    points.push(point)
    drawSegment(canvas.getContext('2d'), active.stroke, points.length - 1)
  }

  function handlePointerEnd(event) {
    if (activeRef.current?.pointerId === event.pointerId) finishStroke()
  }

  function handleKeyDown(event) {
    if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
      event.preventDefault()
      undo()
    }
  }

  // Closes any stroke still in progress, then encodes the canvas.
  const exportDataUrl = useCallback(() => {
    finishStroke()
    const canvas = canvasRef.current
    if (!canvas) throw new Error('The canvas isn’t available.')
    return exportDrawing(canvas)
  }, [finishStroke])

  return {
    setCanvas,
    tool,
    setTool,
    color,
    pickColor,
    size,
    setSize,
    canUndo: summary.steps > 0,
    hasInk: summary.ink > 0,
    undo,
    clear,
    exportDataUrl,
    handleKeyDown,
    pointerHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerEnd,
      onPointerCancel: handlePointerEnd,
    },
  }
}