/** API v3 refuses pages larger than this. */
export const MAX_PAGE_SIZE = 50;

interface Page<T> {
    edges: Array<{ node: T } | null>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
}

/** Follows `endCursor` until the last page and returns every node. */
export async function fetchAllPages<T>(
    fetchPage: (after?: string) => Promise<Page<T>>
): Promise<T[]> {
    const nodes: T[] = [];
    let after: string | undefined;

    for (;;) {
        const page = await fetchPage(after);
        nodes.push(...page.edges.filter((edge) => edge).map((edge) => edge.node));

        if (!page.pageInfo.hasNextPage) {
            return nodes;
        }

        after = page.pageInfo.endCursor;
    }
}
