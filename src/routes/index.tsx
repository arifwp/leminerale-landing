import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useState } from 'react'
import Lenis from 'lenis'

import { Preloader } from '../components/Preloader'
import { Navbar } from '../components/Navbar'
import { SequenceScroll } from '../components/SequenceScroll'
import { LandingSections } from '../components/LandingSections'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    // Stop lenis when loading to prevent scrolling during preloader
    if (loading) {
      lenis.stop()
    } else {
      lenis.start()
    }

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [loading])

  return (
    <div className="bg-black min-h-screen text-white font-sans antialiased selection:bg-white selection:text-black">
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      
      {/* We keep the content rendered but optionally hidden/frozen until loaded, 
          or just let it be under the preloader */}
      <div className={`${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000`}>
        <Navbar />
        <main>
          <SequenceScroll />
          <LandingSections />
        </main>
      </div>
    </div>
  )
}
