FROM node:22.1-alpine as base
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


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