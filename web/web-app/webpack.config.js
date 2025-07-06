'use strict';

const path = require('path');

module.exports = {
  mode: 'development', // TODO 'production'
  entry: path.resolve(__dirname,'./src/app/main.tsx'),
  output: {
    path: path.resolve(__dirname,'./dist/app/'),
    filename: 'app.[contenthash].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      ...backendAlias('@mealz/backend-api', 'api'),
      ...backendAlias(
        '@mealz/backend-users-auth-gateway-api',
        'domains/users/services/auth/gateway-api',
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
