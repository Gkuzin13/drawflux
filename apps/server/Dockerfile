FROM node:18.17-bullseye-slim AS base
RUN npm i -g pnpm

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM dependencies as build
RUN pnpm -r build

FROM base as development
WORKDIR /app
COPY --from=build /app/ .

FROM build as pruned
WORKDIR /app
RUN pnpm --filter ./apps/server deploy pruned --prod
EXPOSE 7456

FROM base as deploy
WORKDIR /app
ENV NODE_ENV=production
COPY --from=pruned /app/pruned/dist ./dist
COPY --from=pruned /app/pruned/package.json package.json
COPY --from=pruned /app/pruned/node_modules node_modules
EXPOSE 3000
ENTRYPOINT ["pnpm", "start"]