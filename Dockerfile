ARG NODE_VERSION=22.15.0

FROM node:${NODE_VERSION} AS builder
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# ------------------------------------------------------------------------------

# Copy the backend
RUN mkdir -p /app/backend
COPY ./backend/backend-server /app/backend/backend-server

# Build the backend
WORKDIR /app/backend/backend-server
RUN npm install
RUN npm run build

# ------------------------------------------------------------------------------

# Copy SQLite tools and databases
RUN mkdir -p /app/backend/sqlite
COPY ./backend/sqlite /app/backend/sqlite

# Build SQLite data & tools
WORKDIR /app/backend/sqlite/tools
RUN npm install
RUN npm run build

# Prepare SQLite databases
RUN mkdir -p /var/db/mealz
RUN node dist/prepare-databases.js /var/db/mealz

# Delete the SQLite data & tools
RUN rm -rf /app/backend/sqlite

# # ------------------------------------------------------------------------------

# Copy the frontend
RUN mkdir -p /app/web/web-app
COPY ./web/web-app /app/web/web-app

# Build the frontend
WORKDIR /app/web/web-app
RUN npm install
RUN npm run build

# ------------------------------------------------------------------------------

FROM node:$NODE_VERSION-slim
ARG NODE_ENV=production 

# Copy stuff
COPY --from=builder /var/db/mealz /var/db/mealz
COPY --from=builder /app/backend/backend-server /app/backend
COPY --from=builder /app/web/web-app/dist/app /app/web-app

# Prepare the environment
ENV NODE_ENV=${NODE_ENV}
ENV MEALZ_USERS_SQLITE_DB_FILE="/var/db/mealz/users.sqlite"
ENV MEALZ_INGREDIENTS_SQLITE_DB_FILE="/var/db/mealz/ingredients.sqlite"
ENV MEALZ_WEB_APP_DIR="/app/web-app"

# Server port
ENV MEALZ_PORT=8080
EXPOSE 8080

# ------------------------------------------------------------------------------

# Run the backend
CMD ["node", "/app/backend/dist/main.js"]
