import { useEffect, useState } from "react";
import { useWindow } from "./use-window";

const SHOW_CARDS: ((width: number) => boolean)[] = [
    (width) => width <= 600,
    (width) => width > 600 && width <= 900,
    (width) => width > 900 && width <= 1400,
    (width) => width > 1400 && width <= 1800,
    (width) => width > 1800,
];

export const useShowCards = () => {
    const [numberOfShownCards, setNumberOfShownCards] = useState<number>();

    const [width] = useWindow();

    useEffect(() => {
        SHOW_CARDS.forEach((showCard, idx) => {
            if (showCard(width)) {
                setNumberOfShownCards(idx + 1);
            }
        });
    }, [width]);

    return numberOfShownCards;
};
