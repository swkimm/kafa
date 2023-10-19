# usage `docker build --tag kafa-staging:latest -f docker/Dockerfile .`

### BUILDER ###
FROM node:20-alpine AS builder

COPY . /build
WORKDIR /build

RUN corepack enable
RUN pnpm --filter=backend deploy out

WORKDIR /build/out
RUN npx prisma generate
RUN npm run build client

### PRODUCTION ###
FROM node:20-alpine

ENV NODE_ENV=production
COPY --from=builder /build/out .
COPY ./docker/entrypoint.sh .

ENTRYPOINT ["./entrypoint.sh"]
