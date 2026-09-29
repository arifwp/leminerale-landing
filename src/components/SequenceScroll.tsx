import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'

import { MagneticButton } from '#/components/MagneticButton'
import { getSequenceFrame, SEQUENCE_FRAME_COUNT } from '#/lib/sequence-assets'

const TIMELINE_STEPS = 240

type StoryProgress = ReturnType<typeof useSpring>

function StoryBeat({
  align = 'center',
  children,
  progress,
  range,
}: {
  align?: 'left' | 'center' | 'right'
  children: React.ReactNode
  progress: StoryProgress
  range: [number, number, number, number]
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0])
  const y = useTransform(progress, range, [42, 0, 0, -42])
  const alignment = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }[align]

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-[8vw] ${alignment}`}
      style={{ opacity, y }}
    >
      {children}
    </motion.div>
  )
}

function drawFrame(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const context = canvas.getContext('2d', { alpha: false })
  if (!context || !image.complete || image.naturalWidth === 0) return

  const scale = Math.max(
    canvas.width / image.naturalWidth,
    canvas.height / image.naturalHeight,
  )
  const width = image.naturalWidth * scale
  const height = image.naturalHeight * scale
  context.fillStyle = '#082f3a'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(
    image,
    (canvas.width - width) / 2,
    (canvas.height - height) / 2,
    width,
    height,
  )
}

export function SequenceScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const frameRef = useRef(0)
  const [loadProgress, setLoadProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 92,
    damping: 28,
    mass: 0.32,
  })

  useEffect(() => {
    let cancelled = false
    let completed = 0
    const images = Array.from({ length: SEQUENCE_FRAME_COUNT }, (_, index) => {
      const image = new Image()
      image.decoding = 'async'
      image.src = getSequenceFrame(index + 1)
      const done = () => {
        if (cancelled) return
        completed += 1
        setLoadProgress(Math.round((completed / SEQUENCE_FRAME_COUNT) * 100))
        if (completed === SEQUENCE_FRAME_COUNT) setIsReady(true)
      }
      image.onload = done
      image.onerror = done
      return image
    })
    imagesRef.current = images

    return () => {
      cancelled = true
      imagesRef.current = []
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animationFrame = 0

    const draw = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * ratio)
      canvas.height = Math.round(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      drawFrame(canvas, imagesRef.current[frameRef.current])
    }
    const requestDraw = () => {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', requestDraw)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', requestDraw)
    }
  }, [isReady])

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const timelineFrame = Math.round(latest * (TIMELINE_STEPS - 1))
    const nextFrame = Math.round(
      (timelineFrame / (TIMELINE_STEPS - 1)) * (SEQUENCE_FRAME_COUNT - 1),
    )
    if (nextFrame === frameRef.current) return
    frameRef.current = nextFrame
    const canvas = canvasRef.current
    const image = imagesRef.current[nextFrame]
    if (canvas) drawFrame(canvas, image)
  })

  return (
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-sequence text-white"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-screen w-full"
          role="img"
          aria-label="Le Minerale bottle in motion"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,18,25,.36),transparent_30%,transparent_64%,rgba(2,18,25,.46))]" />
        <div className="absolute inset-0 grain opacity-25" />

        <StoryBeat progress={smoothProgress} range={[0, 0.02, 0.14, 0.23]}>
          <p className="mb-5 text-xs font-semibold tracking-[0.28em] text-white/70 uppercase">
            Kebaikan dari pegunungan
          </p>
          <h1 className="w-full max-w-6xl text-[clamp(3.1rem,8.4vw,9rem)] font-medium leading-[0.86] tracking-[-0.07em] text-balance">
            Kesegaran yang terasa hidup.
          </h1>
          <p className="mt-7 max-w-md text-sm leading-relaxed text-white/72 md:text-base">
            Gulir perlahan. Temukan mineral alami di setiap tetesnya.
          </p>
        </StoryBeat>

        <StoryBeat
          align="left"
          progress={smoothProgress}
          range={[0.23, 0.3, 0.39, 0.48]}
        >
          <p className="max-w-3xl text-[clamp(2.8rem,6vw,7rem)] font-medium leading-[0.9] tracking-[-0.065em]">
            Bukan sekadar segar. Terasa mineralnya.
          </p>
        </StoryBeat>

        <StoryBeat
          align="right"
          progress={smoothProgress}
          range={[0.5, 0.58, 0.69, 0.78]}
        >
          <p className="max-w-3xl text-[clamp(2.8rem,6vw,7rem)] font-medium leading-[0.9] tracking-[-0.065em]">
            Dari sumber yang terjaga, untuk ritme harimu.
          </p>
        </StoryBeat>

        <StoryBeat progress={smoothProgress} range={[0.78, 0.88, 0.98, 1]}>
          <p className="max-w-4xl text-[clamp(2.9rem,6.7vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.07em]">
            Pilih yang terasa baik.
          </p>
          <MagneticButton href="#story" className="pointer-events-auto mt-9">
            Rasakan bedanya
          </MagneticButton>
        </StoryBeat>

        <div className="absolute right-5 bottom-5 flex items-center gap-3 text-[10px] font-semibold tracking-[0.22em] text-white/65 uppercase md:right-8 md:bottom-7">
          <span>Scroll to explore</span>
          <span className="h-px w-10 bg-white/50" />
        </div>
      </div>

      <AnimatePresence>
        {!isReady && (
          <motion.div
            className="fixed inset-0 z-[100] flex flex-col justify-between bg-sequence p-6 text-white md:p-10"
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <div className="flex items-center justify-between text-xs font-semibold tracking-[0.24em] uppercase">
              <span>Le Minerale</span>
              <span>Natural mineral water</span>
            </div>
            <div>
              <div className="mb-5 flex items-end justify-between gap-8">
                <p className="max-w-sm text-2xl leading-tight tracking-tight md:text-4xl">
                  Preparing a fresher perspective.
                </p>
                <span className="font-mono text-5xl tracking-[-0.08em] md:text-8xl">
                  {loadProgress.toString().padStart(3, '0')}
                </span>
              </div>
              <div className="h-px w-full bg-white/20">
                <motion.div
                  className="h-full bg-white"
                  animate={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
