# Stage 1: Build the React app
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the source code into the container
COPY . ./

# Build the React app for production
RUN npm run build

# Verify the build directory contents
RUN ls -la /app/build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build artifacts from the previous stage to the Nginx directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start Nginx to serve the React app
CMD ["nginx", "-g", "daemon off;"]