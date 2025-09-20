# 1. Base image
FROM node:18-alpine AS builder

# 2. Set working directory
WORKDIR /app

# 3. Copy project files
COPY . .

# 4. Install dependencies and build
RUN npm install && npm run build

# 5. Serve using nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# 6. Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
