let index = 0;

export function getServerUrl(): string {
    const urls = process.env.REACT_APP_SERVER_URL.split(",");

    if (index > urls.length - 1) {
        index = 0;
    }

    return `${urls[index++]}/graphql`;
}
