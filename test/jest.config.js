module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/test/unit/repository/feed-repository.test.ts'],
  rootDir: '../',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}', // Collect coverage only from the src folder
    '!<rootDir>/src/**/*.test.{js,jsx,ts,tsx}', // Exclude test files
    '!<rootDir>/node_modules/**', // Ignore node_modules
  ],
};