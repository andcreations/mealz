#!/bin/bash

MEALZ_DIR=$(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd)

# Link the ingredients types to be able to build the SQLite tools
ln -sf $MEALZ_DIR/backend-server/src/domains/ingredients/db/types/v1 $MEALZ_DIR/sqlite/tools/src/ingredients

# Build the SQLite tools
pushd $PWD > /dev/null
cd $MEALZ_DIR/sqlite/tools
npm ci
npm run build
popd > /dev/null