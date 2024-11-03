# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

ARG REACT_APP_QUESTION_API_URL
ARG REACT_APP_USER_API_URL
ARG REACT_APP_MATCHING_SOCKET_URL
ARG REACT_APP_COLLABORATION_SOCKET_URL

# Bundle app source inside the Docker image
COPY . .

# Run production build
RUN npm run build

FROM nginx

EXPOSE 80

COPY --from=builder /app/build /usr/share/nginx/html