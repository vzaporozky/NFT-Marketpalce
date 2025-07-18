FROM node:20-slim
WORKDIR /app

RUN chown -R node:node /app
USER node

COPY --chown=node:node package*.json ./

RUN npm ci --ignore-scripts

COPY --chown=node:node . .

EXPOSE 8545

CMD ["npx", "hardhat", "node"]