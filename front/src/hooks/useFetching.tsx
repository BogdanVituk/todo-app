import { useState } from "react";

export const useFetching = <T,>(callback: () => Promise<T>) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const fetching = async () => {
        try {
            setIsLoading(true);
            await callback();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError(String(e));
            }
        } finally {
            setIsLoading(false);
        }
    }

    return [fetching, isLoading, error] as const;
}