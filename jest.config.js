/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        isolatedModules: true,
      },
    ],
  },
  //setupFilesAfterEnv: ['./tests/setupTests.ts'],
  //setupFilesAfterEnv: ['<rootDir>/database/singleton.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.config.js',
    'tsconfig.json',
    '/migrations/',
    '/database/',
    '/build/',
    'env',
    'package-lock.json',
    'package.json',
    'schema.prisma',
    'tests/Mocks'
  ]
};