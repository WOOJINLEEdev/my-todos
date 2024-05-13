module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "@typescript-eslint", "prettier", "import"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          ["parent", "sibling"],
          "index",
          "object",
          "type",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@/{hooks,utils,lib}/**",
            group: "internal",
            position: "before",
          },
          {
            pattern: "@/pages/**",
            group: "internal",
          },
          {
            pattern: "@/components/**",
            group: "internal",
          },
          {
            pattern: "@/state/**",
            group: "internal",
            position: "after",
          },
          {
            pattern: "**/*.css",
            group: "unknown",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "prettier/prettier": ["error", { trailingComma: "es5" }],
    "no-restricted-imports": [
      "error",
      {
        patterns: [".*"],
        paths: [
          {
            name: "react",
            importNames: ["default"],
            message: "import React from 'react' makes bundle size larger.",
          },
        ],
      },
    ],
  },
};

// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     "react-app",
//     "eslint:recommended",
//     "prettier",
//     "plugin:@typescript-eslint/recommended",
//     "plugin:react-hooks/recommended",
//     "plugin:prettier/recommended",
//   ],
//   ignorePatterns: ["dist", ".eslintrc.cjs"],
//   parser: "@typescript-eslint/parser",
//   plugins: ["import", "react-refresh"],
//   rules: {
//     "react-refresh/only-export-components": [
//       "warn",
//       { allowConstantExport: true },
//     ],
//     "prettier/prettier": ["error", { trailingComma: "es5" }],
//     "no-restricted-imports": [
//       "error",
//       {
//         patterns: [".*"],
//         paths: [
//           {
//             name: "react",
//             importNames: ["default"],
//             message: "import React from 'react' makes bundle size larger.",
//           },
//         ],
//       },
//     ],
//     "import/order": [
//       "error",
//       {
//         groups: [
//           "builtin",
//           "external",
//           "internal",
//           ["parent", "sibling"],
//           "index",
//           "object",
//           "type",
//           "unknown",
//         ],
//         pathGroups: [
//           {
//             pattern: "react",
//             group: "builtin",
//             position: "before",
//           },
//           {
//             pattern: "@/{hooks,utils,lib}/**",
//             group: "internal",
//             position: "before",
//           },
//           {
//             pattern: "@/pages/**",
//             group: "internal",
//           },
//           {
//             pattern: "@/components/**",
//             group: "internal",
//           },
//           {
//             pattern: "@/state/**",
//             group: "internal",
//             position: "after",
//           },
//           {
//             pattern: "**/*.css",
//             group: "unknown",
//             position: "after",
//           },
//         ],
//         pathGroupsExcludedImportTypes: ["react"],
//         "newlines-between": "always",
//         alphabetize: {
//           // "order": "asc",
//           caseInsensitive: true,
//         },
//       },
//     ],
//   },
//   overrides: [
//     {
//       files: ["*.ts", "*.mts", "*.cts", "*.tsx"],
//       rules: {
//         "no-undef": "off",
//       },
//     },
//   ],
// };
