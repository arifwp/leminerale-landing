'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5
      if (current >= 100) {
        current = 100
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 500)
      }
      setProgress(current)
    }, 100)
    
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div 
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white overflow-hidden"
    >
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-12">
        <div className="font-bold tracking-tighter text-xl uppercase">Le Minerale</div>
        <div className="flex justify-between items-end w-full">
          <div className="text-sm uppercase tracking-widest text-gray-400">Loading Experience</div>
          <div className="text-8xl md:text-[10rem] font-bold tracking-tighter leading-none">
            {progress}%
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white" style={{ width: `${progress}%`, transition: 'width 0.2s ease' }} />
    </motion.div>
  )
}
