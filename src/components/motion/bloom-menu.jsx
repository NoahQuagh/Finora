"use client";

import {
    Bell,
    FileText,
    FolderClosed,
    LayoutGrid,
    Link,
    Plus,
    Table,
    X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";
import { EASE_OUT } from "./../lib/ease";
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs) {
    return twMerge(clsx(inputs))}

const ITEMS = [];

const SPRING_FOLDER = {
    type: "spring",
    stiffness: 300,
    damping: 32,
    mass: 0.9
};

export function BloomMenu({
                              items = ITEMS,
                              onSelect,
                              className,
                              label
                          }) {
    const [open, setOpen] = useState(false);
    const reduce = useReducedMotion();
    const layoutId = useId();
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        const onPointer = (e) => {
            if (ref.current && !ref.current.contains(e.target))
                setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pointerdown", onPointer);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("pointerdown", onPointer);
        };
    }, [open]);

    const morph = reduce ? { duration: 0.15 } : SPRING_FOLDER;

    return (
        <div ref={ref} className={cn("relative inline-flex items-center justify-end", className)}>
            <div className="h-11 w-36" aria-hidden />

            <div className="pointer-events-none absolute right-0 top-0 mt-0.5 z-50 w-[min(86vw,380px)] flex flex-col items-end [&>*]:pointer-events-auto">
                <AnimatePresence initial={false} mode="popLayout">
                    {open ? (
                        <motion.div
                            key="panel"
                            layoutId={layoutId}
                            transition={morph}
                            style={{ borderRadius: 16 }}
                            className="w-full overflow-hidden border border-[var(--color-second-six)] bg-[var(--color-main-secondary)] shadow-2xl origin-top-right"
                        >
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: reduce ? 0 : 0.12, duration: 0.2 }}
                            >
                                <div className="flex items-center justify-between border-b border-[var(--color-second-six)] px-4 py-3">
                  <span className="text-sm font-medium text-[var(--color-second-secondary)]">
                    {label}
                  </span>
                                    <button
                                        type="button"
                                        onClick={() => setOpen(false)}
                                        aria-label="Close menu"
                                        className="text-[var(--color-second-tertiary)] transition-colors hover:text-[var(--color-second-secondary)]"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <motion.div
                                    initial={
                                        reduce ? false : { clipPath: "inset(0% 0% 0% 0%)" }
                                    }
                                    animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                                    transition={{
                                        delay: reduce ? 0 : 0.08,
                                        duration: 0.45,
                                        ease: EASE_OUT,
                                    }}
                                    className="grid grid-cols-3"
                                >
                                    {items.map((item, i) => {
                                        const cols = 3;
                                        const rows = Math.ceil(items.length / cols);
                                        const col = i % cols;
                                        const row = Math.floor(i / cols);
                                        const dist = Math.hypot(
                                            col - (cols - 1) / 2,
                                            row - (rows - 1) / 2,
                                        );
                                        return (
                                            <button
                                                key={item.label}
                                                type="button"
                                                onClick={() => {
                                                    onSelect?.(item.label);
                                                    setOpen(false);
                                                }}
                                                className={cn(
                                                    "flex items-center justify-center px-3 py-6 text-[var(--color-second-tertiary)] optionCreate transition-colors hover:text-[var(--color-second-secondary)] hover:bg-[var(--color-main-quaternary)]",
                                                    i % 3 !== 2 && "border-r border-[var(--color-second-six)]",
                                                    i < 3 && "border-b border-[var(--color-second-six)]",
                                                )}
                                            >
                                                <motion.span
                                                    initial={
                                                        reduce
                                                            ? { opacity: 0 }
                                                            : { opacity: 0, scale: 0.85, filter: "blur(6px)" }
                                                    }
                                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                                    transition={{
                                                        delay: reduce ? 0 : 0.1 + dist * 0.07,
                                                        type: "spring",
                                                        stiffness: 440,
                                                        damping: 34,
                                                    }}
                                                    className="flex flex-col items-center gap-2"
                                                >
                                                    <i
                                                        className={`${item.icon} text-2xl text-[var(--color-second-tertiary)] transition-colors`}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="text-sm font-medium text-[var(--color-second-tertiary)] transition-colors">
                    {item.label}
                </span>
                                                </motion.span>
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="trigger"
                            type="button"
                            layoutId={layoutId}
                            transition={morph}
                            style={{ borderRadius: 16 }}
                            onClick={() => setOpen(true)}
                            aria-haspopup="menu"
                            aria-expanded={open}
                            whileTap={reduce ? undefined : { scale: 0.97 }}
                            className="inline-flex h-10 w-36 items-center justify-center border border-[var(--color-second-six)] bg-[var(--color-main-secondary)] text-sm font-medium text-[var(--color-second-secondary)] hover:bg-[var(--color-main-quaternary)] transition-colors"
                        >
                            <motion.span
                                layout
                                className="inline-flex items-center gap-2 whitespace-nowrap text-[var(--color-second-secondary)]"
                            >
                                {label}
                                <Plus className="h-4 w-4 text-[var(--color-second-secondary)]" />
                            </motion.span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}