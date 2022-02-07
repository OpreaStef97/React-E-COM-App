import { useEffect } from 'react';

function preloadImage(src: string) {
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = reject;
        img.src = src;
    }).catch(console.error);
}
const usePreloadImage = (images: string[]) => {
    useEffect(() => {
        images.forEach(preloadImage);
    }, [images]);
};

export default usePreloadImage;
