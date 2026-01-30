/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: 'src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@mealz/backend-core': '<rootDir>/core',
    '@mealz/backend-common': '<rootDir>/commons/common',
    '@mealz/backend-logger': '<rootDir>/commons/logger',
    '@mealz/backend-ingredients-common': '<rootDir>/domains/ingredients/common',
    '@mealz/backend-ingredients-shared': '<rootDir>/domains/ingredients/shared',
    '@mealz/backend-ingredients-crud-service-api': '<rootDir>/domains/ingredients/services/crud/service-api',
    '@mealz/backend-tracing': '<rootDir>/commons/tracing',
    '@mealz/backend-transport': '<rootDir>/commons/transport'
  }
}
