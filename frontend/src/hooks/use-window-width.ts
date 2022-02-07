import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useWindowWidth = (
    fn1: Dispatch<SetStateAction<number>> | null,
    fn2: Dispatch<SetStateAction<number>> | null
) => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (fn1) {
            fn2 && fn2(0);
            if (width <= 600) {
                fn1(1);
            } else if (width > 600 && width <= 900) {
                fn1(2);
            } else if (width > 900 && width <= 1300) {
                fn1(3);
            } else if (width > 1300 && width <= 1800) {
                fn1(4);
            } else {
                fn1(5);
            }
        }
    }, [width, fn1, fn2]);

    return width;
};

export default useWindowWidth;
