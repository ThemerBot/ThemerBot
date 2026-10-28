FROM node:24-slim AS build

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY ["package*.json", "./"]
RUN npm ci --include=dev
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:24-slim

ENV NODE_ENV=production

WORKDIR /usr/src/app
RUN chown node:node /usr/src/app
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=build --chown=node:node /usr/src/app/build ./build
COPY --from=build --chown=node:node /usr/src/app/assets ./assets
COPY --from=build --chown=node:node /usr/src/app/i18n ./i18n

USER node
CMD ["node", "build/index.js"]
