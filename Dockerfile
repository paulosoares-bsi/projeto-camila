FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages
COPY config ./config
COPY tenants ./tenants
COPY database ./database
COPY scripts ./scripts
COPY tsconfig.json ./

RUN pnpm install --frozen-lockfile

EXPOSE 3333

CMD ["pnpm", "dev:api"]
