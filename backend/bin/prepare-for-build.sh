#!/bin/bash

if [ -n "$BASH_VERSION" ]; then
  # bash
  SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/$(basename "${BASH_SOURCE[0]}")"
elif [ -n "$ZSH_VERSION" ]; then
  # zsh
  SCRIPT_PATH="$(cd "$(dirname "${(%):-%x}")" && pwd)/$(basename "${(%):-%x}")"
else
  echo "Unsupported shell. Please use bash or zsh."
  exit 1
fi
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
BACKEND_DIR="$SCRIPT_DIR/.."

ln -s $BACKEND_DIR/backend-server/src/domains/ingredients/db/types/v1 $BACKEND_DIR/sqlite/tools/src/ingredients/v1
