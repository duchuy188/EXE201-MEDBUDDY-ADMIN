import { useState, useCallback } from 'react';

export interface LazyLoadingState {
    isLoading: boolean;
    isRefreshing: boolean;
}

export const useLazyLoading = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const startLoading = useCallback(() => {
        setIsLoading(true);
    }, []);

    const stopLoading = useCallback(() => {
        setIsLoading(false);
    }, []);

    const startRefreshing = useCallback(() => {
        setIsRefreshing(true);
    }, []);

    const stopRefreshing = useCallback(() => {
        setIsRefreshing(false);
    }, []);

    const refreshWithDelay = useCallback(async (delay: number = 500) => {
        setIsRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, delay));
        setIsRefreshing(false);
    }, []);

    const loadWithDelay = useCallback(async (delay: number = 300) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, delay));
        setIsLoading(false);
    }, []);

    return {
        isLoading,
        isRefreshing,
        startLoading,
        stopLoading,
        startRefreshing,
        stopRefreshing,
        refreshWithDelay,
        loadWithDelay,
    };
};

export default useLazyLoading;