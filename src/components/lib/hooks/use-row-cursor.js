import { useState, useCallback, useEffect } from "react";

export function useRowCursor(items = [], query = "") {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    const moveTo = useCallback((idOrIndex) => {
        if (typeof idOrIndex === "number") {
            setActiveIndex(idOrIndex);
        } else if (idOrIndex === null) {
            setActiveIndex(0);
        } else {
            const idx = items.findIndex((item) => item.id === idOrIndex);
            if (idx !== -1) setActiveIndex(idx);
        }
    }, [items]);

    const moveActive = useCallback((step) => {
        setActiveIndex((prev) => {
            if (items.length === 0) return 0;
            const next = prev + step;
            if (next < 0) return items.length - 1;
            if (next >= items.length) return 0;
            return next;
        });
    }, [items]);

    return {
        activeIndex,
        moveTo,
        moveActive,
    };
}