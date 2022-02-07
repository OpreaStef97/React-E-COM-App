import { useCallback, useState } from 'react';

const useFetch = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const sendRequest = useCallback(async (url: string, method?: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(url, { method: method || 'GET' });
            if (!response.ok) {
                throw new Error('Something went wrong');
            }
            const data = await response.json();
            setIsLoading(false);
            return data;
        } catch (err) {
            setIsLoading(false);
            if (err instanceof Error) {
                setError(err.message);
            }
            throw err;
        }
    }, []);

    const clearError = () => {
        setError(null);
    };

    return { error, isLoading, sendRequest, clearError };
};

export default useFetch;
