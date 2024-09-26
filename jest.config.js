module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testMatch: ['**/tests/**/*.test.js', '**/?(*.)+(spec|test).js'],
  watchman: false,
  testTimeout: 10000,
};
