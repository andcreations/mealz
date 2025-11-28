#!/bin/bash

pushd $PWD > /dev/null

MEALZ_DIR=$(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd)
ENV_FILE=$HOME/.mealz/env
source $ENV_FILE

cd $MEALZ_DIR/sqlite/tools
npm run insert-ingredients $MEALZ_SQLITE_DIR/ingredients.sqlite $MEALZ_DIR/sqlite/ingredients/ingredients.json

popd > /dev/null
