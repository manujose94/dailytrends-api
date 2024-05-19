FROM node:22.1-slim as base
WORKDIR /usr/src/app
USER node
COPY package*.json ./

# Change ownership of the directory to the node user
USER root
RUN chown -R node:node /usr/src/app
USER node

RUN npm ci --only=production
COPY --chown=node:node . .

# Development 
FROM base as development
RUN npm install
RUN npx tsc
CMD ["npm", "run", "start:dev"]

# Production image
FROM base as production
# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_PATH=./dist
RUN npm run build
USER node
CMD ["node", "dist/index.js"]