import { useEffect } from 'react';

async function preloadImage(src: string) {
    try {
        return await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = reject;
            img.src = src;
        });
    } catch (message) {
        return console.error(message);
    }
}
const usePreloadImage = (images: string[]) => {
    useEffect(() => {
        images.forEach(preloadImage);
    }, [images]);
};

export default usePreloadImage;
