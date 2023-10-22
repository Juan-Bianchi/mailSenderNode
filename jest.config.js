/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/database/singleton.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.config.js',
    'tsconfig.json'
  ]
};