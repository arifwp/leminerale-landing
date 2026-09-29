'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion'

const MAX_FRAMES = 192

export function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [images, setImages] = useState<HTMLImageElement[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [bgColor, setBgColor] = useState('#000000')

  // Load all images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = []
      let loadedCount = 0

      for (let i = 1; i <= MAX_FRAMES; i++) {
        const img = new Image()
        // Format index to 3 digits
        const indexStr = i.toString().padStart(3, '0')
        img.src = `/assets/sequences/ezgif-frame-${indexStr}.jpg`
        
        await new Promise((resolve) => {
          img.onload = () => {
            loadedCount++
            loadedImages.push(img)
            resolve(null)
          }
          img.onerror = () => {
            // Handle error, maybe fallback to previous or empty
            resolve(null)
          }
        })
      }
      
      // Sort in case they resolved out of order (though await inside loop prevents it, just safe)
      loadedImages.sort((a, b) => {
        const aNum = parseInt(a.src.match(/frame-(\d+)/)?.[1] || '0')
        const bNum = parseInt(b.src.match(/frame-(\d+)/)?.[1] || '0')
        return aNum - bNum
      })

      setImages(loadedImages)
      setIsLoaded(true)

      // Get background color from the first image
      if (loadedImages.length > 0) {
        const firstImg = loadedImages[0]
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = 1
        tempCanvas.height = 1
        const ctx = tempCanvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(firstImg, 0, 0, 1, 1)
          const data = ctx.getImageData(0, 0, 1, 1).data
          setBgColor(`rgb(${data[0]}, ${data[1]}, ${data[2]})`)
        }
      }
    }

    loadImages()
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth out the scroll progress slightly
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
    restDelta: 0.001
  })

  const frameIndex = useTransform(smoothProgress, [0, 1], [0, MAX_FRAMES - 1])

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isLoaded || images.length === 0 || !canvasRef.current) return
    
    const index = Math.min(MAX_FRAMES - 1, Math.max(0, Math.floor(latest)))
    const img = images[index]
    
    if (img) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Clear and draw matching cover behavior
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        const canvasRatio = canvas.width / canvas.height
        const imgRatio = img.width / img.height
        
        let drawWidth = canvas.width
        let drawHeight = canvas.height
        let offsetX = 0
        let offsetY = 0
        
        if (canvasRatio > imgRatio) {
          drawHeight = canvas.width / imgRatio
          offsetY = (canvas.height - drawHeight) / 2
        } else {
          drawWidth = canvas.height * imgRatio
          offsetX = (canvas.width - drawWidth) / 2
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
      }
    }
  })

  // Handle canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
        
        // Force redraw current frame
        const index = Math.floor(frameIndex.get())
        const img = images[index]
        if (img) {
          const canvas = canvasRef.current
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.fillStyle = bgColor
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            const canvasRatio = canvas.width / canvas.height
            const imgRatio = img.width / img.height
            let drawWidth = canvas.width
            let drawHeight = canvas.height
            let offsetX = 0
            let offsetY = 0
            if (canvasRatio > imgRatio) {
              drawHeight = canvas.width / imgRatio
              offsetY = (canvas.height - drawHeight) / 2
            } else {
              drawWidth = canvas.height * imgRatio
              offsetX = (canvas.width - drawWidth) / 2
            }
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)
          }
        }
      }
    }
    
    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [isLoaded, images, bgColor, frameIndex])

  // Text Opacity Transforms
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.2], [1, 1, 0])
  const slogan1Opacity = useTransform(scrollYProgress, [0.25, 0.3, 0.4, 0.45], [0, 1, 1, 0])
  const slogan2Opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.7, 0.75], [0, 1, 1, 0])
  const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.9], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.85, 0.9], [50, 0])

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[400vh]" 
      style={{ backgroundColor: bgColor }}
    >
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        
        {/* Overlays */}
        <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none p-8 z-10">
          
          {/* Title */}
          <motion.div 
            style={{ opacity: titleOpacity }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-lg uppercase mix-blend-difference">
              The Essence <br />of Purity
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-gray-200 font-light max-w-md drop-shadow-md mix-blend-difference">
              Discover water as nature intended.
            </p>
          </motion.div>

          {/* Slogan 1 */}
          <motion.div 
            style={{ opacity: slogan1Opacity }}
            className="absolute inset-0 flex flex-col items-start justify-center p-12 md:p-24"
          >
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white max-w-2xl leading-tight mix-blend-difference">
              Untouched by man. <br /> Perfected by time.
            </h2>
          </motion.div>

          {/* Slogan 2 */}
          <motion.div 
            style={{ opacity: slogan2Opacity }}
            className="absolute inset-0 flex flex-col items-end justify-center text-right p-12 md:p-24"
          >
            <h2 className="text-4xl md:text-7xl font-bold tracking-tighter text-white max-w-2xl leading-tight mix-blend-difference">
              Sourced from the <br /> deepest springs.
            </h2>
          </motion.div>

          {/* CTA */}
          <motion.div 
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 mix-blend-difference">
              Experience Le Minerale
            </h2>
            <button className="px-10 py-5 bg-white text-black font-semibold rounded-full text-lg hover:scale-105 transition-transform duration-300 shadow-xl flex items-center gap-2 group">
              Order Now
              <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
