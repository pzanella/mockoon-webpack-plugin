module.exports = {
  verbose: true,
  transform: {
    "^.+\\.(t|j)sx?$": "ts-jest"
  },
  modulePathIgnorePatterns: ["<rootDir>/lib/"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: [
    "src/**/*.ts"
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  coverageReporters: ["json-summary"],
};
