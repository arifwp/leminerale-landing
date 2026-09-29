import { motion, useMotionValue, useSpring } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode
  className?: string
  href: string
}) {
  const x = useSpring(useMotionValue(0), { stiffness: 230, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 230, damping: 18 })

  return (
    <motion.div style={{ x, y }} className={className}>
      <Button
        asChild
        size="lg"
        className={cn(
          'h-14 rounded-full bg-white px-7 text-[13px] font-semibold tracking-[0.08em] text-[#082f3a] uppercase shadow-[0_18px_60px_rgba(0,0,0,.2)] hover:bg-[#e8f8fb]',
        )}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect()
          x.set((event.clientX - bounds.left - bounds.width / 2) * 0.18)
          y.set((event.clientY - bounds.top - bounds.height / 2) * 0.18)
        }}
        onMouseLeave={() => {
          x.set(0)
          y.set(0)
        }}
      >
        <a href={href}>
          {children}
          <ArrowDownRight data-icon="inline-end" />
        </a>
      </Button>
    </motion.div>
  )
}
