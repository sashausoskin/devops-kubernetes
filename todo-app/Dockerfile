FROM node:24-alpine AS build-stage

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage ./dist /usr/share/nginx/html