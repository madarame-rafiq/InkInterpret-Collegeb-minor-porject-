// Turns the canvas into the `canvasData` string the server stores.
//
// The backend treats canvasData as an opaque string (max 8M characters), so
// the format is a frontend decision: an image data URL, which the voting
// screen can render with a plain <img>.
//
// Size matters: Socket.IO's default per-message limit is about 1 MB, and the
// server doesn't raise it. So this stays under ~900k characters, trying
// lossless PNG first, then JPEG at falling quality, then half resolution.

const MAX_DATA_URL_CHARS = 900_000

export function exportDrawing(canvas) {
  const attempts = [
    () => canvas.toDataURL('image/png'),
    () => canvas.toDataURL('image/jpeg', 0.85),
    () => canvas.toDataURL('image/jpeg', 0.7),
    () => canvas.toDataURL('image/jpeg', 0.55),
  ]

  for (const attempt of attempts) {
    const dataUrl = attempt()
    if (dataUrl.length <= MAX_DATA_URL_CHARS) return dataUrl
  }

  // Last resort: halve the resolution.
  const small = document.createElement('canvas')
  small.width = Math.round(canvas.width / 2)
  small.height = Math.round(canvas.height / 2)
  small.getContext('2d').drawImage(canvas, 0, 0, small.width, small.height)
  for (const quality of [0.7, 0.5]) {
    const dataUrl = small.toDataURL('image/jpeg', quality)
    if (dataUrl.length <= MAX_DATA_URL_CHARS) return dataUrl
  }

  throw new Error('This drawing is too detailed to send. Clear some of it and try again.')
}