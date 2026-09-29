'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

function TextReveal({ text }: { text: string }) {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.8', 'start 0.2']
  })

  // Split by words, then by characters to preserve word wrapping
  const words = text.split(" ")
  let charIndex = 0
  const totalChars = text.replace(/\s+/g, '').length

  return (
    <p ref={container} className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tighter leading-tight flex flex-wrap gap-x-3 md:gap-x-5">
      {words.map((word, wIdx) => {
        const chars = word.split('')
        return (
          <span key={wIdx} className="flex">
            {chars.map((char, cIdx) => {
              const start = charIndex / totalChars
              const end = start + (1 / totalChars)
              charIndex++
              return (
                <Char key={cIdx} progress={scrollYProgress} range={[start, end]}>{char}</Char>
              )
            })}
          </span>
        )
      })}
    </p>
  )
}

function Char({ children, progress, range }: any) {
  const opacity = useTransform(progress, range, [0.2, 1])
  return (
    <span className="relative">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

function CountUp({ end, suffix = "" }: { end: number, suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setValue(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end])

  return <span ref={ref}>{value}{suffix}</span>
}

export function LandingSections() {
  const testimonials = [
    { text: "The purest water I've ever tasted.", author: "Jane Doe" },
    { text: "A refreshing experience every time.", author: "John Smith" },
    { text: "Nature's best kept secret revealed.", author: "Alice Johnson" },
  ]
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className="relative z-10 bg-white text-black -mt-[100vh] w-full rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.2)]">
      
      {/* About Section */}
      <section className="min-h-screen flex items-center justify-center p-8 md:p-24 border-b border-gray-200">
        <div className="max-w-5xl">
          <p className="uppercase text-sm font-bold tracking-widest text-gray-500 mb-12">The Source</p>
          <TextReveal text="Sourced directly from the volcanic mountains, Le Minerale is naturally filtered through layers of earth to achieve its signature crisp taste." />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-8 md:px-24 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 max-w-6xl mx-auto text-center">
          <div>
            <div className="text-7xl md:text-8xl font-bold tracking-tighter mb-4">
              <CountUp end={100} suffix="%" />
            </div>
            <p className="text-xl text-gray-600 font-medium">Natural Origins</p>
          </div>
          <div>
            <div className="text-7xl md:text-8xl font-bold tracking-tighter mb-4">
              <CountUp end={7} suffix=".2" />
            </div>
            <p className="text-xl text-gray-600 font-medium">Perfect pH Balance</p>
          </div>
          <div>
            <div className="text-7xl md:text-8xl font-bold tracking-tighter mb-4">
              <CountUp end={500} suffix="+" />
            </div>
            <p className="text-xl text-gray-600 font-medium">Meters Deep</p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-32 px-8 md:px-24 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <p className="uppercase text-sm font-bold tracking-widest text-gray-500 mb-12">The Anatomy of Purity</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[800px]">
            <div className="md:col-span-2 bg-gray-100 rounded-[2rem] p-10 flex flex-col justify-end group overflow-hidden relative">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548815160-c3d3a04f2603?q=80&w=3269&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 text-white">
                <h3 className="text-4xl font-bold tracking-tight mb-2">Mountain Spring</h3>
                <p className="text-lg text-gray-200">Untouched nature at its finest.</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-[2rem] p-10 flex flex-col justify-between">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Essential Minerals</h3>
                <p className="text-gray-600">Naturally enriched with calcium and magnesium.</p>
              </div>
            </div>
            <div className="bg-gray-900 text-white rounded-[2rem] p-10 flex flex-col justify-between">
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Global Reach</h3>
                <p className="text-gray-400">Bringing purity to every corner of the world.</p>
              </div>
            </div>
            <div className="md:col-span-2 bg-gray-100 rounded-[2rem] p-10 flex flex-col justify-end group overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555505019-8c3f1c4aba5f?q=80&w=3270&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
               <div className="absolute inset-0 bg-black/20" />
               <div className="relative z-10 text-white">
                <h3 className="text-4xl font-bold tracking-tight mb-2">Eco-Friendly Packaging</h3>
                <p className="text-lg text-gray-200">100% recyclable bottles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="min-h-screen bg-black text-white flex flex-col justify-center px-8 md:px-24 overflow-hidden relative">
        <p className="absolute top-24 left-8 md:left-24 uppercase text-sm font-bold tracking-widest text-gray-500">Testimonials</p>
        <div className="max-w-6xl w-full mx-auto relative h-[40vh] flex items-center">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ 
                opacity: i === activeTestimonial ? 1 : 0, 
                y: i === activeTestimonial ? 0 : 50,
                pointerEvents: i === activeTestimonial ? 'auto' : 'none'
              }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <h3 className="text-4xl md:text-7xl font-bold tracking-tighter leading-tight mb-8">"{t.text}"</h3>
              <p className="text-xl md:text-2xl text-gray-400 font-medium">— {t.author}</p>
            </motion.div>
          ))}
        </div>
        <div className="absolute bottom-24 left-8 md:left-24 flex gap-4">
          {testimonials.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTestimonial(i)}
              className={`w-16 h-1 transition-colors duration-500 ${i === activeTestimonial ? 'bg-white' : 'bg-gray-800'}`} 
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-br from-blue-900 to-black z-0"
        />
        <div className="relative z-10 text-center text-white px-8">
          <h2 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8">Taste Purity</h2>
          <button className="px-12 py-6 bg-white text-black font-semibold rounded-full text-xl hover:scale-105 transition-transform duration-300 shadow-2xl flex items-center gap-3 group mx-auto">
            Order Now
            <span className="group-hover:translate-x-2 transition-transform inline-block">→</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-8 md:px-24 border-t border-gray-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 mb-24">
          <div className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">Le Minerale</div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="font-bold tracking-widest text-sm text-gray-500 uppercase mb-2">Explore</h4>
              <a href="#" className="hover:text-gray-400 transition-colors">Home</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Story</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Purity</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold tracking-widest text-sm text-gray-500 uppercase mb-2">Social</h4>
              <a href="#" className="hover:text-gray-400 transition-colors">Instagram</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Twitter</a>
              <a href="#" className="hover:text-gray-400 transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-sm text-gray-500">
          <p>© 2026 Le Minerale. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
