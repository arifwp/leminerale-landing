'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const links = ['Home', 'Story', 'Purity', 'Contact']

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 p-6 flex justify-between items-center mix-blend-difference text-white">
        <div className="font-bold text-xl uppercase tracking-widest cursor-pointer z-50">
          Le Minerale
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="z-50 uppercase text-sm font-semibold tracking-widest"
        >
          {isOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(100% 0 0% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-white text-black flex flex-col justify-center px-12 md:px-24"
          >
            <div className="flex flex-col gap-4">
              {links.map((link, i) => (
                <div key={link} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '-100%' }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="text-6xl md:text-8xl font-bold tracking-tighter uppercase cursor-pointer hover:text-gray-500 transition-colors"
                  >
                    {link}
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-black/20 pt-8"
            >
              <div className="flex gap-8 text-sm font-medium">
                <a href="#" className="hover:underline">Instagram</a>
                <a href="#" className="hover:underline">Twitter</a>
                <a href="#" className="hover:underline">LinkedIn</a>
              </div>
              <div className="text-sm font-medium">
                hello@leminerale.com
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
