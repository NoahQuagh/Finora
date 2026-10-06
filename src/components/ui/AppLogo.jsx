import React from "react";

export function AppLogo({ title = "Together", className = "" }) {
    return (
        <div className={`flex items-center gap-3 select-none ${className}`}>
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-second-secondary)] text-black shadow-sm transition-transform active:scale-95">
                  <span className="font-serif text-lg leading-none select-none">
                    T
                  </span>
            </div>

            <span className="sb-title truncate text-base font-bold text-white tracking-tight group-data-[state=collapsed]/sidebar:hidden">
        {title}
      </span>
        </div>
    );
}