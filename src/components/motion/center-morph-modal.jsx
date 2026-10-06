import React, { createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const CenterMorphContext = createContext({
    isOpen: false,
    setIsOpen: () => {},
});

export function CenterMorphModal({ children, open, onOpenChange, defaultOpen = false }) {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : uncontrolledOpen;

    const setIsOpen = React.useCallback(
        (value) => {
            if (!isControlled) {
                setUncontrolledOpen(value);
            }
            if (onOpenChange) {
                onOpenChange(value);
            }
        },
        [isControlled, onOpenChange]
    );

    return (
        <CenterMorphContext.Provider value={{ isOpen, setIsOpen }}>
            <AnimatePresence mode="wait">
                {isOpen && children}
            </AnimatePresence>
        </CenterMorphContext.Provider>
    );
}

export function CenterMorphModalTrigger({ children, asChild }) {
    const { setIsOpen } = useContext(CenterMorphContext);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: (e) => {
                children.props.onClick?.(e);
                setIsOpen(true);
            },
        });
    }

    return (
        <div onClick={() => setIsOpen(true)} className="inline-block cursor-pointer">
            {children}
        </div>
    );
}

export function CenterMorphModalContent({
                                            children,
                                            ariaLabel = "Modal",
                                            dismissible = true,
                                            showCloseButton = true,
                                            closeButtonLabel = "Close modal",
                                            className,
                                            backdropClassName,
                                        }) {
    const { isOpen, setIsOpen } = useContext(CenterMorphContext);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && dismissible) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, dismissible, setIsOpen]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                onClick={() => dismissible && setIsOpen(false)}
                className={cn("fixed inset-0 bg-black/70 backdrop-blur-sm", backdropClassName)}
            />

            <motion.div
                initial={{
                    opacity: 0,
                    scale: 0.2,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                }}
                exit={{
                    opacity: 0,
                    scale: 0.2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    mass: 0.8,
                }}
                className={cn(
                    "relative z-10 w-full max-w-lg overflow-hidden text-zinc-100 shadow-2xl",
                    className
                )}
            >
                {showCloseButton && (
                    <button
                        type="button"
                        aria-label={closeButtonLabel}
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}

                {children}
            </motion.div>
        </div>
    );
}