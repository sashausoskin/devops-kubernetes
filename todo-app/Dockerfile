FROM node:24-alpine AS build-stage

ENV VITE_TODOS_BACKEND_URL=http://localhost:8081

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:alpine

COPY --from=build-stage ./dist /usr/share/nginx/html