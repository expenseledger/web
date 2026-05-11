const DEFAULT_RETRY_DELAY = 1000;

const withRetry = async <T>(fn: () => Promise<T>, retryCount: number = 3): Promise<T> => {
    try {
        return await fn();
    } catch (err) {
        if (retryCount === 0) {
            throw err;
        }

        const delay = DEFAULT_RETRY_DELAY * 2 ** (retryCount - 1);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return withRetry(fn, retryCount - 1);
    }
};

export default withRetry;
