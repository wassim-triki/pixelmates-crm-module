# Étape 1 : Build des dépendances
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Étape 2 : Image finale pour exécution
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODB_URI=mongodb://mongodb:27017/prod

EXPOSE 3000

CMD ["node", "src/index.js"]
