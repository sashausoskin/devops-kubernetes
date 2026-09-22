FROM node:24-alpine AS build-stage

COPY . .

RUN npm ci

RUN npx tsc --outDir dist

FROM node:24-alpine

WORKDIR /usr/src/app

COPY --from=build-stage ./dist .

COPY ./package-lock.json .
COPY ./package.json .

RUN npm ci

CMD [ "node", "index.js" ]