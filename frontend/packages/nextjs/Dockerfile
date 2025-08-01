FROM node:18-alpine AS builder
WORKDIR /app

RUN chown -R node:node /app

RUN corepack enable

USER node

COPY --chown=node:node package.json ./
RUN yarn install

COPY --chown=node:node . .

RUN yarn build



FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Set proper permissions for the working directory
RUN chown -R node:node /app

# Enable Corepack in the runner stage
RUN corepack enable

# Switch to the node user
USER node

# Copy only the necessary files from the builder stage
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/public ./public

# Expose the port Next.js will run on
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Start the Next.js application
CMD ["yarn", "serve"]