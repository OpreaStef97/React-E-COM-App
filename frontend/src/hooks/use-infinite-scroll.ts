import { useRef, useCallback } from "react";

export const useInfiniteScroll = ({
    isLoading,
    hasMore,
    setPage,
}: {
    isLoading: boolean;
    hasMore: boolean;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
    const observer = useRef<IntersectionObserver>();

    const lastItemRef = useCallback(
        <T>(node: T) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    hasMore && setPage((prev) => ++prev);
                }
            });
            if (node) observer.current.observe(node as unknown as Element);
        },
        [hasMore, isLoading, setPage]
    );

    return lastItemRef;
}
