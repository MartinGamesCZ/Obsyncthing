ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS dependencies
RUN npm i -g pnpm@latest-11

WORKDIR /app
COPY package.json /app
COPY pnpm-lock.yaml /app
COPY pnpm-workspace.yaml /app

RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

FROM node:${NODE_VERSION} AS runtime
RUN npm i -g pnpm@latest-11

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . /app

CMD ["pnpm", "start:dev"]