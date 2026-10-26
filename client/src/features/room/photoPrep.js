// Prepares a chosen photo for game:capture:submit.
//
// The backend accepts PNG, JPEG or WebP data URLs up to 8 MiB of decoded bytes
// and does the authoritative validation, orientation fix and sanitising. This
// module only makes phone photos practical to send: a modern camera produces
// 3–10 MB files, so anything not small is downscaled and re-encoded as JPEG
// with browser APIs. That also keeps every socket message comfortably small.

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
export const ACCEPT_ATTRIBUTE = ACCEPTED_TYPES.join(',')

const REFUSE_ABOVE_BYTES = 40 * 1024 * 1024 // don't even try to decode absurd files
const SEND_AS_IS_BYTES = 600 * 1024 // small enough to send untouched
const MAX_DATA_URL_CHARS = 900_000 // keeps one socket message under ~1 MB

// [longest edge in px, JPEG quality], tried in order until it fits.
const ENCODING_LADDER = [
  [1600, 0.85],
  [1600, 0.7],
  [1200, 0.6],
  [900, 0.5],
]

function readAsDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('That file couldn’t be read.'))
    reader.readAsDataURL(blob)
  })
}

// Decodes with the browser, applying EXIF orientation where supported.
async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        release: () => bitmap.close(),
      }
    } catch {
      // Fall through to the <img> decoder below.
    }
  }

  const url = URL.createObjectURL(file)
  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('That image couldn’t be read. Try a different photo.'))
      element.src = url
    })
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(url),
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

function encodeJpeg({ source, width, height }, maxEdge, quality) {
  const scale = Math.min(1, maxEdge / Math.max(width, height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * scale))
  canvas.height = Math.max(1, Math.round(height * scale))
  const context = canvas.getContext('2d')
  context.fillStyle = '#ffffff' // transparent PNGs become white paper, not black
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', quality)
}

// Resolves to { dataUrl, resized }, or throws an Error with a message that is
// safe to show to the player.
export async function prepareImage(file) {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Choose a PNG, JPEG or WebP image.')
  }
  if (file.size === 0) {
    throw new Error('That file is empty. Choose a different photo.')
  }
  if (file.size > REFUSE_ABOVE_BYTES) {
    throw new Error('That file is too large. Choose a smaller photo.')
  }

  if (file.size <= SEND_AS_IS_BYTES) {
    return { dataUrl: await readAsDataUrl(file), resized: false }
  }

  const decoded = await decode(file)
  try {
    for (const [edge, quality] of ENCODING_LADDER) {
      const dataUrl = encodeJpeg(decoded, edge, quality)
      if (dataUrl.length <= MAX_DATA_URL_CHARS) return { dataUrl, resized: true }
    }
  } finally {
    decoded.release()
  }

  throw new Error('That photo couldn’t be shrunk enough to send. Try a different one.')
}