module.exports = {
  testPathIgnorePatterns: ["/node_modules", "/.next"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  // babel-jest transpiling ts in js for testing
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  testEnvironment: "jsdom"
};