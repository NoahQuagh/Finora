import React, { useEffect } from "react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react"
import { formatEUR } from "./../lib/Format"

/** Montant en euros qui "roule" jusqu'à sa valeur (même idée que l'Animated counter d'Arc). */
export function AnimatedMoney({ value, className }) {
    const reduce = useReducedMotion()
    const mv = useMotionValue(reduce ? value : 0)
    const text = useTransform(mv, (v) => formatEUR(v))

    useEffect(() => {
        if (reduce) {
            mv.set(value)
            return
        }
        const controls = animate(mv, value, { duration: 1.1, ease: [0.22, 1, 0.36, 1] })
        return () => controls.stop()
    }, [value, reduce, mv])

    return <motion.span className={className}>{text}</motion.span>
}