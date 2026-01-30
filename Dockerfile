FROM node:20-alpine

WORKDIR /app

# 1. Copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# 2. Install dependencies inside the image
RUN npm install

# 3. Copy the rest of the application code
COPY . .

# 4. Default command (can be overridden by docker-compose)
CMD ["npm", "run", "dev"]