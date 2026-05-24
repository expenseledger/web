import withRetry from "../../../service/helper/retryHelper";

describe("retryHelper", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("returns result when fn succeeds on first attempt", async () => {
        const fn = jest.fn().mockResolvedValue("ok");

        await expect(withRetry(fn)).resolves.toBe("ok");
        expect(fn).toHaveBeenCalledTimes(1);
    });

    it("retries after failure and returns on success", async () => {
        const fn = jest
            .fn()
            .mockRejectedValueOnce(new Error("temporary"))
            .mockResolvedValue("ok");

        const promise = withRetry(fn, 1);

        await jest.advanceTimersByTimeAsync(1000);
        await expect(promise).resolves.toBe("ok");
        expect(fn).toHaveBeenCalledTimes(2);
    });

    it("throws after all retries are exhausted", async () => {
        const error = new Error("persistent failure");
        const fn = jest.fn().mockRejectedValue(error);

        const promise = withRetry(fn, 1);
        const assertion = expect(promise).rejects.toThrow("persistent failure");

        await jest.advanceTimersByTimeAsync(1000);
        await assertion;
        expect(fn).toHaveBeenCalledTimes(2);
    });
});
