import { useState, useEffect } from "react";

export const useImageLoad = (src: string) => {
    const [sourceLoaded, setSourceLoaded] = useState<string | null>(null);
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setSourceLoaded(src);
    }, [src]);

    return sourceLoaded;
};
