import { RefObject, useEffect, useState } from 'react';

export default function useIntersect<T>(ref?: RefObject<T> | null) {
    const [intersecting, setIntersecting] = useState(true);
    useEffect(() => {
        if (!ref) {
            return;
        }
        const obs = new IntersectionObserver(
            entries => {
                const ent = entries[0];
                setIntersecting(ent.isIntersecting === true);
            },
            {
                root: null,
                threshold: 0,
                rootMargin: '0px',
            }
        );
        if (ref.current) {
            obs.observe(ref.current as unknown as Element);
        }
        return () => obs.disconnect();
    }, [ref]);

    return intersecting;
}
