#!/bin/bash

pushd $PWD > /dev/null

mealz_dir=$(cd $(dirname ${BASH_SOURCE[0]})/.. && pwd)
env_file=$HOME/.mealz/env
source $env_file

cd $mealz_dir/sqlite/tools
npm run migrate-databases $MEALZ_SQLITE_DIR

popd > /dev/null
