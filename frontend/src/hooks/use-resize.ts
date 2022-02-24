import { MutableRefObject, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';

const useObserver = <T>(callback: () => void, element: MutableRefObject<T>) => {
    const current = element && element.current;

    const observer = useRef<ResizeObserver>();

    const observe = useCallback(() => {
        if (current && observer.current) {
            observer.current?.observe(current as unknown as Element);
        }
    }, [current]);

    useEffect(() => {
        // if we are already observing old element
        if (observer && observer.current && current) {
            observer.current.unobserve(current as unknown as Element);
        }
        const resizeObserverOrPolyfill = ResizeObserver;
        observer.current = new resizeObserverOrPolyfill(callback);
        observe();

        return () => {
            if (observer && observer.current && current) {
                observer.current.unobserve(current as unknown as Element);
            }
        };
    }, [callback, current, element, observe]);
};

useObserver.propTypes = {
    element: PropTypes.object,
    callback: PropTypes.func,
};

export default useObserver;
