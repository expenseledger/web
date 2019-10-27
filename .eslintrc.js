module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    extends: [
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin,
        "plugin:react/recommended"
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module" // Allows for the use of imports
    },
    plugins: ["react-hooks"],
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        semi: ["error", "always"],
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-explicit-any": "off",
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        "@typescript-eslint/explicit-member-accessibility": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
    }
};
