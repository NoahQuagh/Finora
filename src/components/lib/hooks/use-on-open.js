import { useEffect, useRef } from "react";

export function useOnOpen(isOpen, callback) {
    const previousOpenRef = useRef(false);

    useEffect(() => {
        if (isOpen && !previousOpenRef.current) {
            callback();
        }
        previousOpenRef.current = isOpen;
    }, [isOpen, callback]);
}