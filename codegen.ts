import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    // API v3, copied from ledger-api-v3 (see the header of schema.graphql).
    schema: "schema.graphql",
    documents: ["src/**/*.ts", "!src/tests/**", "!src/mock/**"],
    hooks: { afterAllFileWrite: ["prettier --write"] },
    generates: {
        "./src/service/model/gql/": {
            preset: "client",
            presetConfig: {
                fragmentMasking: false,
            },
        },
    },
};
export default config;
