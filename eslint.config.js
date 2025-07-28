import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends(
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:prettier/recommended",
    ),
    plugins: {
        "react-hooks": fixupPluginRules(reactHooks),
    },
    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.jest,
        },
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
    },
    rules: {
        semi: ["error", "always"],
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-expressions": ["error", {
            allowShortCircuit: true,
            allowTernary: true,
        }],
        quotes: ["error", "double", {
            allowTemplateLiterals: true,
        }],
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": ["warn", {
            additionalHooks: "useRecoilCallback",
        }],
    },
    settings: {
        react: {
            version: "detect"
        }
    }
}]);