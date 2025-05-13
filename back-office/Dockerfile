# Étape de construction
FROM node:18-alpine as builder

WORKDIR /app

# Installation des dépendances système requises
RUN apk add --no-cache python3 make g++

# 1. Copier uniquement les fichiers nécessaires pour npm ci
COPY package.json package-lock.json ./

# 2. Nettoyer le cache et installer les dépendances
RUN npm cache clean --force && \
    npm ci --quiet --no-optional

# 3. Copier le reste des fichiers
COPY . .

# Build de l'application
RUN npm run build

# Étape de production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]