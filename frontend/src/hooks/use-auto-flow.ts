import { useEffect } from 'react';

export const useAutoFlow = ({
    autoFlow = false,
    clicked,
    flowTo = 'right',
    delay = 0,
    nextHandler,
    prevHandler,
    clickHandler,
}: {
    autoFlow: boolean;
    clicked: boolean;
    flowTo: string;
    delay: number;
    nextHandler: () => void;
    prevHandler: () => void;
    clickHandler: (clicked: boolean) => void;
}) => {
    useEffect(() => {
        if (!autoFlow) {
            return;
        }
        let interval: NodeJS.Timer;
        let timeout: NodeJS.Timeout;
        // sleep
        if (!clicked) {
            interval = setInterval(() => {
                if (flowTo === 'right') {
                    nextHandler();
                }
                if (flowTo === 'left') {
                    prevHandler();
                }
            }, delay || 2000);
        } else {
            timeout = setTimeout(() => {
                clickHandler(false);
            }, 20000);
        }
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [autoFlow, flowTo, delay, clicked, nextHandler, prevHandler, clickHandler]);
}
