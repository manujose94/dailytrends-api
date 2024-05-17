FROM node:22.1-slim as base

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (if available).
# COPY package*.json ./

# Install production dependencies.
# If you add a package-lock.json, speed your build by switching to 'npm ci'.
# RUN npm install --only=production

# Copy local code to the container image.
#COPY . .
COPY --chown=node:node . /usr/src/app
# Install TypeScript
RUN npm install -g typescript

# Compile TypeScript into JavaScript
# RUN tsc
USER node  
FROM base as development

# Run the web service on container startup.
CMD [ "node", "dist/index.js" ]

FROM base as production

ENV NODE_PATH=./build

RUN npm run build