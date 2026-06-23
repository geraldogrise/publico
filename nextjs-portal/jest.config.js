/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Override para rodar TypeScript do Next (ESM) no Node via CommonJS.
        tsconfig: {
          module: "CommonJS",
          moduleResolution: "node",
          esModuleInterop: true,
          jsx: "react-jsx",
          isolatedModules: false,
          verbatimModuleSyntax: false,
          skipLibCheck: true,
          strict: false,
        },
      },
    ],
  },
  collectCoverageFrom: [
    "src/server/**/*.ts",
    "src/lib/saml.ts",
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      statements: 70,
    },
  },
  clearMocks: true,
};
