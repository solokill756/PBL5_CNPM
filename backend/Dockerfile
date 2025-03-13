# ---- Build Stage ----
FROM node:20-alpine AS builder

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

EXPOSE 9000

CMD ["npm", "start"]
