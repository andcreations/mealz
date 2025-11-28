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

GREEN="\033[32m"
RESET="\033[0m"

pushd $PWD > /dev/null

# Build the backend
cd $SCRIPT_DIR/backend/backend-server
echo -e "--------------- 8< --------------- ${GREEN}backend: clean${RESET}"
npm run clean
echo -e "--------------- 8< --------------- ${GREEN}backend: prepare for build${RESET}"
$SCRIPT_DIR/backend/bin/prepare-for-build.sh
echo -e "--------------- 8< --------------- ${GREEN}backend: install dependencies${RESET}"
npm install
echo -e "--------------- 8< --------------- ${GREEN}backend: build${RESET}"
npm run build

# Build the web application
cd $SCRIPT_DIR/web/web-app
echo -e "--------------- 8< --------------- ${GREEN}web: clean${RESET}"
npm run clean
echo -e "--------------- 8< --------------- ${GREEN}web: install dependencies${RESET}"
npm install
echo -e "--------------- 8< --------------- ${GREEN}web: build tools${RESET}"
npm run build-tools
echo -e "--------------- 8< --------------- ${GREEN}web: build${RESET}"
npm run build-all

# Build the SQLite tools
cd $SCRIPT_DIR/backend/sqlite/tools
echo -e "--------------- 8< --------------- ${GREEN}sqlite: clean${RESET}"
npm run clean
echo -e "--------------- 8< --------------- ${GREEN}sqlite: install dependencies${RESET}"
npm install
echo -e "--------------- 8< --------------- ${GREEN}sqlite: build${RESET}"
npm run build

# Build the release package
cd $SCRIPT_DIR
echo -e "--------------- 8< --------------- ${GREEN}release: build${RESET}"
VERSION=$(date +"%Y%m%d")
RELEASE_DIR=mealz

# Recreate the release directory
rm -rf $RELEASE_DIR
mkdir $RELEASE_DIR

# Copy backend and web application
cp -r $SCRIPT_DIR/backend/backend-server $RELEASE_DIR/backend-server
rm -rf $RELEASE_DIR/backend-server/bin
cp -r $SCRIPT_DIR/web/web-app/dist/app $RELEASE_DIR/web-app

# Copy SQLite tools
cp -r $SCRIPT_DIR/backend/sqlite $RELEASE_DIR/sqlite

# Copy release template
cp -r $SCRIPT_DIR/release/* $RELEASE_DIR

# Create the release file
RELEASE_FILE=mealz-$VERSION.tgz
tar cfz $RELEASE_FILE $RELEASE_DIR

# Clean up
echo -e "--------------- 8< --------------- ${GREEN}release: clean up${RESET}"
rm -rf $RELEASE_DIR
echo -e "Release file: ${GREEN}$RELEASE_FILE${RESET}"

popd > /dev/null