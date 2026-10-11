FROM node:24-alpine as build-stage

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./.npmrc ./.npmrc

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    --mount=type=secret,id=NODE_AUTH_TOKEN \
    NODE_AUTH_TOKEN="$(cat /run/secrets/NODE_AUTH_TOKEN)" \
    pnpm install --frozen-lockfile

COPY ./public ./public
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json
COPY ./tsconfig.node.json ./tsconfig.node.json
COPY ./index.html ./index.html
COPY ./docker/nginx.conf ./nginx.conf
COPY ./docker/.env.production ./.env.production

RUN pnpm run build

FROM nginx:stable-alpine-slim

RUN rm /etc/nginx/conf.d/*
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/

COPY ./docker/env.sh /docker-entrypoint.d/env.sh

RUN chmod +x /docker-entrypoint.d/env.sh