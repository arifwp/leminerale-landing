import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { ArrowDownRight, ArrowLeft, ArrowRight, Menu, X } from 'lucide-react'

import { MagneticButton } from '#/components/MagneticButton'
import { SequenceScroll } from '#/components/SequenceScroll'
import { Button } from '#/components/ui/button'
import { getSequenceFrame } from '#/lib/sequence-assets'

const navigation = [
  { label: 'Cerita kami', href: '#story' },
  { label: 'Mineral alami', href: '#minerals' },
  { label: 'Cerita segar', href: '#voices' },
  { label: 'Temukan kami', href: '#contact' },
]

const testimonials = [
  {
    quote:
      'Rasanya ringan, segarnya tinggal lebih lama. Selalu ada di tas ketika hari bergerak cepat.',
    role: 'Pelari pagi, Jakarta',
  },
  {
    quote:
      'Setelah perjalanan panjang, satu teguk mengembalikan ritme. Sederhana, tapi terasa berbeda.',
    role: 'Pesepeda akhir pekan, Bandung',
  },
  {
    quote:
      'Dingin, jernih, dan pas. Kesegaran kecil yang membuat jeda kerja terasa benar-benar berarti.',
    role: 'Creative lead, Surabaya',
  },
]

const bentoFrames = {
  hero: getSequenceFrame(144),
  splash: getSequenceFrame(120),
  detail: getSequenceFrame(180),
}

function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 text-white mix-blend-difference md:px-9 md:py-7">
        <a
          href="#top"
          className="brand-mark text-white"
          aria-label="Le Minerale home"
        >
          Le Minerale
        </a>
        <Button
          variant="ghost"
          size="icon-lg"
          className="rounded-full border border-white/35 text-white hover:bg-white hover:text-[#082f3a]"
          aria-label="Open navigation"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <Menu />
        </Button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-[#e9f3f3] text-[#082f3a]"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between px-5 py-5 md:px-9 md:py-7">
              <span className="brand-mark">Le Minerale</span>
              <Button
                variant="ghost"
                size="icon-lg"
                className="rounded-full border border-[#082f3a]/25"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            <nav className="flex flex-1 flex-col justify-center px-5 md:px-[8vw]">
              {navigation.map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-[#082f3a]/15 py-2 text-[clamp(3rem,8vw,8.5rem)] font-medium leading-[0.95] tracking-[-0.07em] text-[#082f3a]"
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.2 + index * 0.08,
                    duration: 0.65,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <span className="transition-transform duration-500 group-hover:translate-x-5">
                    {item.label}
                  </span>
                  <ArrowDownRight className="size-[0.42em] -rotate-45 opacity-30 transition-all duration-500 group-hover:rotate-0 group-hover:opacity-100" />
                </motion.a>
              ))}
            </nav>
            <div className="flex flex-col justify-between gap-5 px-5 py-6 text-xs font-semibold tracking-[0.18em] uppercase md:flex-row md:px-9">
              <div className="flex gap-6">
                <a href="#instagram">Instagram</a>
                <a href="#youtube">YouTube</a>
                <a href="#tiktok">TikTok</a>
              </div>
              <a href="mailto:halo@leminerale.com">halo@leminerale.com</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function TextReveal() {
  const root = useRef<HTMLParagraphElement>(null)
  const copy =
    'Kesegaran bukan hanya tentang dingin. Ia lahir dari perjalanan panjang air melewati lapisan batuan pegunungan, membawa mineral alami hingga terasa di setiap teguk.'

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      const characters = root.current?.querySelectorAll('[data-character]')
      if (!characters) return
      gsap.fromTo(
        characters,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.018,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 78%',
            end: 'bottom 42%',
            scrub: 1,
          },
        },
      )
    },
    { scope: root },
  )

  return (
    <p
      ref={root}
      className="max-w-[17ch] text-[clamp(2.8rem,6.5vw,7.4rem)] font-medium leading-[0.97] tracking-[-0.065em]"
    >
      {copy.split('').map((character, index) => (
        <span
          key={`${character}-${index}`}
          data-character
          className="will-change-opacity"
        >
          {character}
        </span>
      ))}
    </p>
  )
}

function Bento() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)
      gsap.utils.toArray<HTMLElement>('[data-bento-image]').forEach((image) => {
        gsap.fromTo(
          image,
          { scale: 0.86, opacity: 0.45 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: image,
              start: 'top 92%',
              end: 'center 55%',
              scrub: 1,
            },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="grid min-h-[880px] grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-[2rem] bg-[#082f3a]/15 md:grid-cols-12 md:grid-rows-6"
    >
      <article className="group relative min-h-[560px] overflow-hidden bg-[#082f3a] text-white md:col-span-6 md:row-span-6">
        <img
          data-bento-image
          src={bentoFrames.hero}
          alt="Le Minerale bottle suspended in water"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#031a22]/90 via-transparent to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-7 md:p-10">
          <p className="max-w-xl text-4xl font-medium leading-none tracking-[-0.05em] md:text-6xl">
            Mineral alami, bergerak bersama hidup.
          </p>
        </div>
      </article>
      <article className="group relative min-h-[320px] overflow-hidden bg-[#c7dde0] md:col-span-6 md:row-span-3">
        <img
          data-bento-image
          src={bentoFrames.splash}
          alt="Water droplets surrounding Le Minerale"
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#082f3a]/15" />
        <div className="absolute top-6 left-6 max-w-[14rem] text-sm font-medium leading-relaxed text-white md:top-8 md:left-8">
          Dijaga sejak sumber, hadir jernih sampai ke tanganmu.
        </div>
      </article>
      <article className="flex min-h-[320px] flex-col justify-between bg-[#f0f7f6] p-7 md:col-span-6 md:row-span-3 md:p-10">
        <p className="max-w-sm text-lg leading-relaxed text-[#31545d]">
          Komposisi mineral memberi karakter rasa yang lembut, segar, dan khas.
        </p>
        <div className="flex items-end justify-between gap-6">
          <p className="text-5xl font-medium tracking-[-0.07em] md:text-7xl">
            Ada manis-manisnya.
          </p>
          <div className="size-16 shrink-0 overflow-hidden rounded-full md:size-20">
            <img
              src={bentoFrames.detail}
              alt="Le Minerale detail"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
        </div>
      </article>
    </div>
  )
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    const startedAt = performance.now()
    const duration = 1400
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1)
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, value])

  return (
    <span ref={ref}>
      {count.toString().padStart(value < 10 ? 2 : 1, '0')}
      {suffix}
    </span>
  )
}

function Stats() {
  return (
    <section
      className="bg-[#082f3a] px-5 py-32 text-white md:px-10 md:py-48"
      id="minerals"
    >
      <div className="mx-auto grid max-w-[1500px] divide-y divide-white/15 border-y border-white/15 md:grid-cols-3 md:divide-x md:divide-y-0">
        <div className="flex min-h-72 flex-col justify-between py-8 md:px-8">
          <p className="text-xs tracking-[0.22em] text-white/55 uppercase">
            Sequence moments
          </p>
          <p className="text-[clamp(4.5rem,9vw,10rem)] font-medium leading-none tracking-[-0.08em]">
            <CountUp value={192} />
          </p>
        </div>
        <div className="flex min-h-72 flex-col justify-between py-8 md:px-8">
          <p className="text-xs tracking-[0.22em] text-white/55 uppercase">
            Scroll journey
          </p>
          <p className="text-[clamp(4.5rem,9vw,10rem)] font-medium leading-none tracking-[-0.08em]">
            <CountUp value={4} suffix="×" />
          </p>
        </div>
        <div className="flex min-h-72 flex-col justify-between py-8 md:px-8">
          <p className="text-xs tracking-[0.22em] text-white/55 uppercase">
            Fresh focus
          </p>
          <p className="text-[clamp(4.5rem,9vw,10rem)] font-medium leading-none tracking-[-0.08em]">
            <CountUp value={100} suffix="%" />
          </p>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % testimonials.length),
      5600,
    )
    return () => window.clearInterval(timer)
  }, [])

  const change = (direction: number) =>
    setActive(
      (current) =>
        (current + direction + testimonials.length) % testimonials.length,
    )

  return (
    <section
      id="voices"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#dcebed] px-5 py-32 text-[#082f3a] md:px-10"
    >
      <div className="absolute right-[-12vw] top-[-10vw] size-[55vw] min-h-96 min-w-96 rounded-full border border-[#082f3a]/10" />
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="mb-16 flex items-end justify-between gap-8">
          <p className="max-w-xs text-sm leading-relaxed text-[#31545d]">
            Cerita kecil dari mereka yang memilih jeda segar di tengah hari yang
            terus bergerak.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full border-[#082f3a]/20 bg-transparent"
              aria-label="Previous testimonial"
              onClick={() => change(-1)}
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-lg"
              className="rounded-full border-[#082f3a]/20 bg-transparent"
              aria-label="Next testimonial"
              onClick={() => change(1)}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
        <div className="relative min-h-[420px] md:min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={active}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="max-w-[19ch] text-[clamp(3rem,7.2vw,8.6rem)] font-medium leading-[0.92] tracking-[-0.075em]">
                “{testimonials[active].quote}”
              </p>
              <footer className="mt-10 text-xs font-semibold tracking-[0.2em] uppercase">
                {testimonials[active].role}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`h-1 flex-1 transition-colors duration-500 ${index === active ? 'bg-[#082f3a]' : 'bg-[#082f3a]/15'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="water-orbit relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#b8d8db] px-5 py-32 text-center text-[#082f3a]">
      <div className="absolute inset-0 grain opacity-35" />
      <div className="relative flex flex-col items-center">
        <p className="mb-6 text-xs font-semibold tracking-[0.24em] uppercase">
          Jeda yang terasa
        </p>
        <h2 className="max-w-5xl text-[clamp(3.6rem,9vw,10rem)] font-medium leading-[0.84] tracking-[-0.08em]">
          Segarkan harimu, mulai dari sini.
        </h2>
        <MagneticButton href="#top" className="mt-10">
          Kembali ke awal
        </MagneticButton>
      </div>
    </section>
  )
}

export function LandingPage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.86,
    })
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])

  return (
    <main id="top" className="w-full max-w-full overflow-x-clip bg-[#eaf3f3]">
      <Navbar />
      <SequenceScroll />
      <div className="relative z-10 -mt-[100vh] overflow-hidden rounded-t-[2rem] bg-[#eaf3f3] md:rounded-t-[3rem]">
        <section id="story" className="px-5 py-32 md:px-10 md:py-48">
          <div className="mx-auto max-w-[1500px]">
            <div className="mb-20 flex justify-between gap-10 text-xs font-semibold tracking-[0.22em] text-[#31545d] uppercase">
              <span>Terbentuk oleh alam</span>
              <span className="hidden md:block">Pegunungan Indonesia</span>
            </div>
            <TextReveal />
          </div>
        </section>
        <section className="px-5 pb-32 md:px-10 md:pb-48">
          <div className="mx-auto max-w-[1500px]">
            <Bento />
          </div>
        </section>
        <Stats />
        <Testimonials />
        <FinalCta />
        <footer
          id="contact"
          className="bg-[#061f28] px-5 py-12 text-white md:px-10 md:py-16"
        >
          <div className="mx-auto max-w-[1500px]">
            <div className="flex flex-col justify-between gap-16 border-b border-white/15 pb-16 md:flex-row md:items-end">
              <p className="brand-mark text-3xl">Le Minerale</p>
              <div className="grid grid-cols-2 gap-x-14 gap-y-4 text-sm text-white/65 md:grid-cols-4">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-white/65 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 pt-8 text-[11px] tracking-[0.18em] text-white/45 uppercase md:flex-row">
              <span>© 2026 Le Minerale concept experience</span>
              <span>Crafted for a fresher perspective</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
