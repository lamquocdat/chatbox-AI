import { useRef, useCallback } from 'react';

/**
 * Hook quản lý AbortController để cancel API requests
 */
export const useAbortController = () => {
    const abortControllerRef = useRef<AbortController | null>(null);

    const createController = useCallback(() => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new controller
        abortControllerRef.current = new AbortController();
        return abortControllerRef.current;
    }, []);

    const abort = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    const getSignal = useCallback(() => {
        return abortControllerRef.current?.signal;
    }, []);

    return {
        createController,
        abort,
        getSignal,
    };
};
