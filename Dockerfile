# Building layer
FROM node:18.7.0@sha256:2eef0e2d04ac0aaa5d7cefbc24a137c42c925d9dffa5a2568cda7618a1378976 AS builder

WORKDIR /home/node

# Copy configuration files
COPY tsconfig*.json ./
COPY package*.json ./

# Install dependencies from package-lock.json, see https://docs.npmjs.com/cli/v7/commands/npm-ci
RUN yarn install

# Copy application sources (.ts, .tsx, js)
COPY src/ src/

# Build application (produces dist/ folder)
RUN yarn build

# Runtime (production) layer
FROM node:18.7.0-alpine3.15@sha256:3b3c0f40c15171d184c76462b1c5a5c851b7527b90c0f4c84db9e591e2578b0a as production

RUN apk add --no-cache curl

WORKDIR /home/node

# Copy dependencies files
COPY package*.json ./

# Install runtime dependecies (without dev/test dependecies)
RUN yarn install

# Copy production build
COPY --from=builder /home/node/dist/ ./dist/

# Expose application port
EXPOSE ${PORT}
# Start application
CMD ["yarn", "start"]