let index = 0;

/** Round-robins over VITE_SERVER_URL, a comma-separated list of GraphQL endpoints. */
export function getServerUrl(): string {
    const urls = import.meta.env.VITE_SERVER_URL.split(",");

    if (index > urls.length - 1) {
        index = 0;
    }

    return urls[index++];
}
