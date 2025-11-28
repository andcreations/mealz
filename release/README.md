# Mealz release

This directory contains the Mealz release. The `bin` directory contains the following scripts:
- `prepare.sh` Prepares the release. It's necessary to run the script to migrate the SQLite databases and to be able to insert ingredients.
- `migrate.sh` Migrates the SQLite databases. It does nothing if all the migrations are up. 
- `insert-ingredients.sh` Inserts ingredients to the SQLite database. It overwrites the existing ones.
- `start.sh` Starts the server.
- `stop.sh` Stops the server.

The above scripts depend on the `env` file. See [`env` file](#env-file) for details.

## `env` file

The `env` file provides variables necessary to run the server. The scripts look for the file in the directory `$HOME/.mealz`. The file should like look as below assuming the home directory is `/home/mealz`:

```sh
export MEALZ_NODE=/home/mealz/.nvm/versions/node/v22.15.0/bin/node

export MEALZ_JWT_SECRET="jwt0s3cr3t"
export MEALZ_WEB_APP_DIR="/home/mealz/mealz/web-app"

export MEALZ_SQLITE_DIR="/home/mealz/.mealz/db"
export MEALZ_USERS_SQLITE_DB_FILE="$MEALZ_SQLITE_DIR/users.sqlite"
export MEALZ_INGREDIENTS_SQLITE_DB_FILE="$MEALZ_SQLITE_DIR/ingredients.sqlite"
export MEALZ_MEALS_SQLITE_DB_FILE="$MEALZ_SQLITE_DIR/meals.sqlite"
export MEALZ_MEALS_USER_SQLITE_DB_FILE="$MEALZ_SQLITE_DIR/meals-user.sqlite"
export MEALZ_MEALS_LOG_SQLITE_DB_FILE="$MEALZ_SQLITE_DIR/meals-log.sqlite"
export MEALZ_MEALS_DAILY_PLAN_SQLITE_DB_FILE="$MEALZ_SQLITE_DIR/meals-daily-plan.sqlite"
```