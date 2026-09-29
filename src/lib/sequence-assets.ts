const sequenceModules = import.meta.glob<string>(
  '/assets/sequences/ezgif-frame-*.jpg',
  { eager: true, import: 'default', query: '?url' },
) as Partial<Record<string, string>>

export const SEQUENCE_FRAME_COUNT = 192

export function getSequenceFrame(frame: number) {
  const normalizedFrame = Math.min(
    SEQUENCE_FRAME_COUNT,
    Math.max(1, Math.round(frame)),
  )
  const path = `/assets/sequences/ezgif-frame-${String(normalizedFrame).padStart(3, '0')}.jpg`
  const url = sequenceModules[path]

  if (!url) {
    throw new Error(`Missing sequence asset: ${path}`)
  }

  return url
}
