# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /elearning/backend

# Cài dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Build TypeScript
RUN npx tsc

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /elearning/backend

# Cài dependency cho production
COPY --from=builder /elearning/backend/package*.json ./
RUN npm install --omit=dev

# Copy build output
COPY --from=builder /elearning/backend/dist ./dist

# Copy .sequelizerc nếu có (nếu dùng để custom path Sequelize)
# COPY --from=builder /elearning/backend/.sequelizerc ./.sequelizerc

# Chạy migration và seed trước khi khởi động server
CMD sh -c "npx sequelize-cli db:seed:all --seeders-path dist/seeders && \
           node dist/server.js"
