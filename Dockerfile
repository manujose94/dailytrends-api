FROM node:22.1-alpine AS base
WORKDIR /usr/src/app
# Install dependencies
COPY package*.json ./
RUN npm install
# Copy source code
COPY . .
# Build the TypeScript files
RUN npm run build
# Create a non-root user
RUN chown -R node:node /usr/src/app

# Development 
FROM base AS development
USER node
RUN npm install
CMD ["npm", "run", "start:dev"]

# Production image
FROM base AS production
WORKDIR /usr/src/app
# Set environment variables for production
ENV NODE_ENV=production
ENV NODE_PATH=./dist
# Copy only the built application and package files
COPY --from=base /usr/src/app ./dist
COPY --from=base /usr/src/app/package*.json ./
# Install production dependencies only
RUN npm ci --only=production

USER node
CMD ["node", "dist/index.js"]