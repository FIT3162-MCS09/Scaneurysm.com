FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Install serve to run the production build
RUN npm install -g serve

RUN npm install -g axios

# Install jwt-decode package for JWT authentication
RUN npm install -g jwt-decode

# Start server
CMD ["serve", "-s", "build", "-l", "80"]