# ---- Giai đoạn Build ----
FROM node:20-alpine AS builder

WORKDIR /elearning/backend

# Sao chép package.json và package-lock.json
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn
COPY . .
# Build TypeScript
RUN npx tsc

# ---- Giai đoạn Production ----
FROM node:20-alpine

WORKDIR /elearning/backend

# Cài bash và curl
RUN apk add --no-cache bash curl

# Tải và cấp quyền cho wait-for-it.sh
RUN curl -sSL https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -o /wait-for-it.sh \
    && chmod +x /wait-for-it.sh

# Sao chép package.json và package-lock.json từ giai đoạn builder
COPY --from=builder /elearning/backend/package*.json ./
# Cài đặt chỉ các dependency cho production
RUN npm install --omit=dev

# Sao chép các file cần thiết từ giai đoạn builder
COPY --from=builder /elearning/backend/dist ./dist
COPY --from=builder /elearning/backend/src/config ./src/config
COPY --from=builder /elearning/backend/src/seeders ./src/seeders
COPY --from=builder /elearning/backend/.sequelizerc ./.sequelizerc
COPY --from=builder /elearning/backend/src/migrations ./src/migrations

# Command khởi chạy ứng dụng
CMD ["/bin/bash", "-c", "\
  /wait-for-it.sh database-mysql:3306 --timeout=60 --strict && \
  npx sequelize-cli db:migrate --migrations-path src/migrations --debug && \
  npx sequelize-cli db:seed:all --seeders-path src/seeders --debug && \
  node dist/server.js"]

