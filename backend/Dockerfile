# ---- Giai đoạn Build ----
FROM node:20-alpine AS builder

WORKDIR /elearning/backend

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build TypeScript
RUN npx tsc

# ---- Giai đoạn Production ----
FROM node:20-alpine

WORKDIR /elearning/backend

# Cài bash và wait-for-it
RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Sao chép package.json và package-lock.json từ giai đoạn builder
COPY --from=builder /elearning/backend/package*.json ./
# Cài đặt chỉ các dependency cho production
RUN npm install --omit=dev

# Sao chép các file JavaScript đã build
COPY --from=builder /elearning/backend/dist ./dist

# Sao chép thư mục src/config
COPY --from=builder /elearning/backend/src/config ./src/config
COPY --from=builder /elearning/backend/src/seeders ./src/seeders

# Sao chép file .sequelizerc
COPY --from=builder /elearning/backend/.sequelizerc ./.sequelizerc

# Chờ MySQL sẵn sàng, chạy seeders, rồi khởi động server
CMD sh -c "/wait-for-it.sh database-mysql:3306 --timeout=60 --strict -- npx sequelize-cli db:seed:all --seeders-path src/seeders --debug && \
           node dist/server.js"