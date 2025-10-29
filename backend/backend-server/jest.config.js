/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@mealz/backend-core': '<rootDir>/core',
    '@mealz/backend-common': '<rootDir>/common',
    '@mealz/backend-logger': '<rootDir>/logger'
  }
}
