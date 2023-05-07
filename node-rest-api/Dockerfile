# Base: This stage will have things common for docker with Node.js
FROM node:18.15.0-alpine AS base
# Set the working directory to /app
WORKDIR /app 
# Copy package.json and package-lock.json to /app
COPY package*.json .
# Install dependencies with npm ci
RUN npm ci
EXPOSE 3000

# Stage: Create a lightweight image with only the app code
FROM base as dev
WORKDIR /app 
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . .
# Start the server
CMD ["npm", "start"]

# Stage: This stage will have components useful for production environment
FROM base as production
WORKDIR /app 
ENV NODE_ENV=production
# Install only production dependencies with npm ci
RUN npm ci  --production 
COPY . .
CMD ["npm", "start"]