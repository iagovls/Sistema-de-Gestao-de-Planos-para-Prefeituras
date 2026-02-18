import nextPlugin from "@next/eslint-plugin-next";

export default [
  // Ignore Next.js build output
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/out/**", "**/build/**"],
  },
  nextPlugin.configs["core-web-vitals"],
];
