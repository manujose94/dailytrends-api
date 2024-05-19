FROM node:22.1-alpine as base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build
RUN npm ci --only=production

# Development 
FROM base as development
USER node
CMD ["npm", "run", "start:dev"]

# Production image
FROM base as production
# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_PATH=./dist
COPY --from=base /usr/src/app ./dist
USER node
CMD ["node", "dist/index.js"]