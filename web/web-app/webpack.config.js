'use strict';

const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: path.resolve(__dirname,'./src/app/main.tsx'),
  output: {
    path: path.resolve(__dirname,'./dist/app/'),
    filename: 'app.[contenthash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      ...backendAlias(
        '@mealz/backend-api',
        'api',
      ),
      ...backendAlias(
        '@mealz/backend-calculators',
        'commons/calculators',
      ),
      ...backendAlias(
        '@mealz/backend-shared',
        'shared',
      ),
      ...backendAlias(
        '@mealz/backend-gateway-api',
        'gateway/api',
      ),
      ...backendAlias(
        '@mealz/backend-users-auth-gateway-api',
        'domains/users/services/auth/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-ingredients-shared',
        'domains/ingredients/shared',
      ),
      ...backendAlias(
        '@mealz/backend-ingredients-gateway-api',
        'domains/ingredients/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-ingredients-crud-gateway-api',
        'domains/ingredients/services/crud/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-meals-gateway-api',
        'domains/meals/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-meals-user-gateway-api',
        'domains/meals/services/user/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-meals-log-gateway-api',
        'domains/meals/services/log/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-meals-daily-plan-gateway-api',
        'domains/meals/services/daily-plan/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-meals-named-gateway-api',
        'domains/meals/services/named/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-meals-ai-scan-gateway-api',
        'domains/meals/services/ai-scan/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-hydration-daily-plan-gateway-api',
        'domains/hydration/services/daily-plan/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-hydration-log-gateway-api',
        'domains/hydration/services/log/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-telegram-users-gateway-api',
        'domains/telegram/services/users/gateway-api',
      ),
      ...backendAlias(
        '@mealz/backend-users-properties-gateway-api',
        'domains/users/services/properties/gateway-api',
      ),
    },
    fallback: {
      crypto: false, // provided by browser
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  cache: {
    type: 'filesystem',
  },
  ...(isProduction
    ? {
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },
    }
    : {}
  ),
}

function backendAlias(name, dir) {
  return {
    [name]: path.resolve(
      __dirname,
      '../../backend/backend-server/src',
      dir,
    ),
  }
}
