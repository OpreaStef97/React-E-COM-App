import { useCallback, useEffect, useState } from 'react';

const useClickOutside = (wrapperRef: any) => {
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: Event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Element)
            ) {
                setClicked(true);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef, clicked]);

    const clearClick = useCallback(() => setClicked(false), []);

    return { clicked, clearClick };
};

export default useClickOutside;
