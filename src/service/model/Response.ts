interface Response {
    status: number;
    data: any | null;
    success: boolean;
    error: Error | null;
}

export default Response;
