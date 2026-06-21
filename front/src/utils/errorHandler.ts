import axios from 'axios';

export const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (typeof responseData === 'object' && responseData !== null && 'message' in responseData) {
            return (responseData as { message: string }).message;
        }
        return typeof responseData === 'string' ? responseData : error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
};
