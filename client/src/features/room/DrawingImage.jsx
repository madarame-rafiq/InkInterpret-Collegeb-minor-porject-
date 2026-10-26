import { useEffect, useState } from 'react'
import { apiFetch } from '../../lib/api.js'

const IMAGE_DATA_URL = /^data:image\/(?:png|jpeg|webp);base64,/

function Frame({ children }) {
  return <div className="relative aspect-[4/3] w-full overflow-hidden bg-sheet">{children}</div>
}

function Failed({ onRetry }) {
  return (
    <div className="grid size-full place-items-center p-4 text-center">
      <div>
        <p className="text-sm font-semibold">This drawing couldn’t be loaded.</p>
        <button
          type="button"
          onClick={(event) => {
            // Inside a selectable card: retrying must not also select it.
            event.preventDefault()
            event.stopPropagation()
            onRetry()
          }}
          className="mt-2 rounded-control border-2 border-ink px-3 py-1 text-sm font-semibold hover:bg-ink hover:text-paper"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

function Skeleton() {
  return <div aria-hidden="true" className="absolute inset-0 bg-paper-deep motion-safe:animate-pulse" />
}

// entry: { publicId, type: 'canvas' | 'photo', assetUrl }
function Loaded({ entry, alt, onRetry }) {
  const isCanvas = entry.type === 'canvas'
  const [state, setState] = useState({ status: 'loading', src: isCanvas ? null : entry.assetUrl })

  // Canvas entries are JSON ({ canvasData }), not images, so fetch and unwrap.
  useEffect(() => {
    if (!isCanvas) return undefined
    const controller = new AbortController()

    apiFetch(entry.assetUrl, { signal: controller.signal })
      .then((payload) => {
        const canvasData = payload?.canvasData
        if (typeof canvasData !== 'string' || !IMAGE_DATA_URL.test(canvasData)) {
          throw new Error('Unsupported drawing data')
        }
        setState({ status: 'ready', src: canvasData })
      })
      .catch((error) => {
        if (controller.signal.aborted || error.name === 'AbortError') return
        setState({ status: 'error', src: null })
      })

    return () => controller.abort()
  }, [isCanvas, entry.assetUrl])

  if (state.status === 'error') {
    return (
      <Frame>
        <Failed onRetry={onRetry} />
      </Frame>
    )
  }

  return (
    <Frame>
      {state.status === 'loading' && <Skeleton />}
      {state.src && (
        <img
          src={state.src}
          alt={alt}
          onLoad={() => setState((current) => ({ ...current, status: 'ready' }))}
          onError={() => setState({ status: 'error', src: null })}
          className={`size-full object-contain ${state.status === 'ready' ? '' : 'invisible'}`}
        />
      )}
    </Frame>
  )
}

export default function DrawingImage({ entry, alt }) {
  // Changing the key remounts the loader, which is how Retry re-requests.
  const [attempt, setAttempt] = useState(0)
  return (
    <Loaded
      key={`${entry.publicId}:${attempt}`}
      entry={entry}
      alt={alt}
      onRetry={() => setAttempt((count) => count + 1)}
    />
  )
}