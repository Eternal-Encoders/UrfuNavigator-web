FROM node:18.18-alpine as build-stage
WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

ARG ORIGIN
ENV VITE_ORIGIN $ORIGIN

RUN yarn install

COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./nginx.conf ./nginx.conf
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./index.html ./index.html

RUN yarn build

FROM nginx:stable-alpine-slim

RUN rm /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/

EXPOSE 80

CMD nginx -g 'daemon off;'