import { useCallback, useEffect, useRef, useState } from 'react';

type HttpFetch = {
    url: string;
    method?: string;
    headers?: { [key: string]: string };
    body?: { [key: string]: any } | null;
    formData?: FormData | null;
    credentials?: RequestCredentials;
};

const useFetch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>();

    const activeHttpRequests = useRef<AbortController[]>([]);

    const sendRequest = useCallback(
        async ({
            url,
            method = 'GET',
            headers = {},
            body = null,
            credentials = 'omit',
            formData = null,
        }: HttpFetch) => {
            setIsLoading(true);

            // in case the user switches pages while sending the request
            const httpAbortCtrl = new AbortController();
            activeHttpRequests.current.push(httpAbortCtrl);

            try {
                const response = await fetch(url, {
                    method,
                    body: (body ? JSON.stringify(body) : null) || formData,
                    headers,
                    signal: httpAbortCtrl.signal,
                    credentials,
                });

                // clear abort controllers after request
                activeHttpRequests.current = activeHttpRequests.current.filter(
                    reqCtrl => reqCtrl !== httpAbortCtrl
                );

                if (!response) {
                    throw new Error('Something went wrong');
                }

                if (response.statusText === 'No Content') {
                    setIsLoading(false);
                    return;
                }

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);

                return responseData;
            } catch (err) {
                let errMsg = 'Something went wrong, please try again.';

                if (err instanceof Error) {
                    errMsg = err.message ?? errMsg;
                }

                setError(errMsg);
                setIsLoading(false);
                throw err;
            }
        },
        []
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};

export default useFetch;
