module.exports = {
    verbose: true,
    testMatch: [
        "**/tests/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    collectCoverageFrom: [
        "dist/**/*.js",
        "!dist/constants.js",
        "!dist/schema.json",
        "!dist/index.js"
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    coverageReporters: ["json-summary"]
};