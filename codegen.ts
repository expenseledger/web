import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "https://expense-ledger.forestware.org/graphql",
    documents: ["src/**/*.ts"],
    generates: {
        "./src/service/model/gql/": {
            preset: "client",
        },
    },
};
export default config;
