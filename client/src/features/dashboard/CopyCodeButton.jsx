import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CopyCodeButton({ code }) {
  const [status, setStatus] = useState('idle') // 'idle' | 'copied' | 'failed'
  const timerRef = useRef(null)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  async function handleCopy() {
    clearTimeout(timerRef.current)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
    timerRef.current = setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy room code ${code}`}
        className="inline-flex items-center gap-2 rounded-control border-2 border-ink px-3 py-1.5 text-sm font-semibold hover:bg-ink hover:text-paper"
      >
        {status === 'copied' ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {status === 'copied' ? 'Copied' : 'Copy'}
      </button>

      {/* Persistent live region so the result is announced to screen readers */}
      <span role="status" className="text-sm font-semibold text-vermilion-deep">
        {status === 'failed' && 'Couldn’t copy. Select the code and copy it manually.'}
        {status === 'copied' && <span className="sr-only">Room code copied</span>}
      </span>
    </span>
  )
}