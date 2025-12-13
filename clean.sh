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

pushd $PWD > /dev/null

cd $SCRIPT_DIR
find . -type d \( -name dist -o -name node_modules -o -name build \) -prune -exec rm -rf {} +

popd > /dev/null
