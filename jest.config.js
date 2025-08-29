const dotenv = require('dotenv');
dotenv.config({path: './env.testing'});

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/v1/__tests__/testSetup.ts'],
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'],
  verbose: true,
};