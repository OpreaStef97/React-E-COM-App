import { useCallback } from 'react';
import useWindow from './use-window';

export default function useSmoothScroll() {
    const [width] = useWindow();

    const smoothScroll = useCallback(() => {
        if (width <= 1100) {
            return;
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        return new Promise<void>((resolve, reject) => {
            const failed = setTimeout(() => {
                reject();
            }, 2000);

            const scrollHandler = () => {
                if (window.scrollY === 0) {
                    window.removeEventListener('scroll', scrollHandler);
                    clearTimeout(failed);
                    resolve();
                }
            };
            if (window.scrollY === 0) {
                clearTimeout(failed);
                resolve();
            } else {
                window.addEventListener('scroll', scrollHandler);
            }
        });
    }, [width]);

    return smoothScroll;
}
