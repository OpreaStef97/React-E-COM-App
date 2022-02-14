import { useState, useEffect } from 'react';

const useImageLoad = (src: string) => {
    const [sourceLoaded, setSourceLoaded] = useState<string | null>(null);
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setSourceLoaded(src);

        return () => {
            setSourceLoaded(null);
            img.onload = null;
        };
    }, [src]);

    return sourceLoaded;
};

export default useImageLoad;
