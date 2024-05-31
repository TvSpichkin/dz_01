/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/__тесты__/**/*.[jt]s?(x)", "**/?(*.)+(спец|тест).[jt]s?(x)"]
};