FROM node:22.1-alpine as base
WORKDIR /usr/src/app

COPY . .
RUN npm install

RUN npm run build
RUN chown -R node:node /usr/src/app

# Development 
FROM base as development
USER node
CMD ["npm", "run", "start:dev"]

# Production image
FROM base as production
WORKDIR /usr/src/app
# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_PATH=./dist

COPY --from=base /usr/src/app ./dist
COPY --from=base /usr/src/app/package*.json ./

RUN npm ci --only=production

USER node
CMD ["node", "dist/index.js"]