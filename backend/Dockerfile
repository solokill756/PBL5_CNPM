# ---- Build Stage ----
FROM node:20-alpine AS builder

# # Cài đặt python3, make, g++ và tạo symlink cho python
# RUN apk update && apk add --no-cache python3 py3-pip make g++ \
#     && ln -sf /usr/bin/python3 /usr/bin/python

# # Đặt biến môi trường PYTHON
# ENV PYTHON=/usr/bin/python3

WORKDIR /elearning/backend

COPY package*.json ./

RUN npm install 

COPY . .

RUN npx tsc

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /elearning/backend

COPY --from=builder /elearning/backend/package*.json ./
COPY --from=builder /elearning/backend/dist ./dist

RUN npm install --omit=dev

CMD ["npm", "start"]
