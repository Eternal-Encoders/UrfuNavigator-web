FROM node:18.18-alpine as build-stage
WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn install

COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./nginx.conf ./nginx.conf
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./index.html ./index.html
COPY ./.env.production ./.env.production

RUN yarn build

FROM nginx:stable-alpine-slim

RUN rm /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/

COPY env.sh /docker-entrypoint.d/env.sh
RUN chmod +x /docker-entrypoint.d/env.sh