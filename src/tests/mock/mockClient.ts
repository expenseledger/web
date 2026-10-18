import { ApolloClient } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";
import { createCache } from "../../lib/apolloCache";
import { createMockV3, MockV3 } from "../../mock/mockV3";
import { v3Sdl } from "./v3Schema";

let mock: MockV3 = createMockV3(v3Sdl);

/**
 * An Apollo client backed by the in-memory API v3. Use it in place of
 * `lib/apollo`:
 *
 * jest.mock("../../lib/apollo", () => ({
 *     __esModule: true,
 *     default: jest.requireActual("../mock/mockClient").mockClient,
 * }));
 */
export const mockClient = new ApolloClient({
    link: new SchemaLink({
        schema: mock.schema,
        // Delegates to the current mock, which resetMockV3 replaces.
        rootValue: new Proxy({}, { get: (_, field: string) => mock.rootValue[field] }),
        validate: true,
    }),
    cache: createCache(),
});

/** Starts over with an empty backend and cache. */
export async function resetMockV3(): Promise<void> {
    mock = createMockV3(v3Sdl);
    await mockClient.clearStore();
}
