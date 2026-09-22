FROM node:24-alpine AS build-stage

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage ./dist /usr/share/nginx/html