/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@mealz/backend-api': '<rootDir>/../../backend/backend-server/src/api',
    '@mealz/backend-users-auth-gateway-api': '<rootDir>/../../backend/backend-server/src/domains/users/services/auth/gateway-api',
    '@mealz/backend-ingredients-shared': '<rootDir>/../../backend/backend-server/src/domains/ingredients/shared',
    '@mealz/backend-ingredients-gateway-api': '<rootDir>/../../backend/backend-server/src/domains/ingredients/gateway-api',
    '@mealz/backend-ingredients-crud-gateway-api': '<rootDir>/../../backend/backend-server/src/domains/ingredients/services/crud/gateway-api'
  }
}
