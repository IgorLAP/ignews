module.exports = {
  testPathIgnorePatterns: ["/node_modules", "/.next"],
  setupFilesAfterEnv: [
    "<rootDir>/src/tests/setupTests.ts"
  ],
  // babel-jest transpiling ts in js for testing
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  // library 'identity-obj-proxy' handles non transpillable to js files
  moduleNameMapper: {
    "\\.(scss|css|sass|svg|jpg|png|jpeg)$": "identity-obj-proxy",
  },
  testEnvironment: "jsdom",
  collectCoverage: true, 
  collectCoverageFrom: [
    "src/**/*.tsx",
    "!src/**/*.spec.tsx",
    "!src/pages/_app.tsx",
    "!src/pages/_document.tsx",
  ],
  coverageReporters: [
    "lcov", "json"
  ]
};