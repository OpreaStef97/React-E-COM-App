import { useEffect, useState } from 'react';
import useWindow from './use-window';

export default function useShowCards() {
    const [numberOfShownCards, setNumberOfShownCards] = useState<number>();

    const [width] = useWindow();

    useEffect(() => {
        if (width <= 600) {
            setNumberOfShownCards(1);
        } else if (width > 600 && width <= 900) {
            setNumberOfShownCards(2);
        } else if (width > 900 && width <= 1400) {
            setNumberOfShownCards(3);
        } else if (width > 1400 && width <= 1800) {
            setNumberOfShownCards(4);
        } else {
            setNumberOfShownCards(5);
        }
    }, [width]);

    return numberOfShownCards;
}
