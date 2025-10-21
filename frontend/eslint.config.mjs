import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import storybook from "eslint-plugin-storybook";
import mantine from "eslint-config-mantine";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = tseslint.config(
  // Add ignores as a separate configuration object first
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "**/next-env.d.ts",
      "**/*.{mjs,cjs,js,d.ts,d.mts}",
      ".storybook/**",
    ],
  },

  // Apply Mantine config first (includes jsx-a11y, React, TypeScript rules)
  ...mantine,

  // Add Next.js TypeScript config only (this includes the @next/next plugin)
  ...compat.extends("next/typescript"),

  // Add Storybook config
  ...storybook.configs["flat/recommended"],

  // Custom overrides
  {
    rules: {
      // Override any conflicting rules here if needed
    },
  },
);

export default eslintConfig;
