# ================================
# Dockerfile pour le Frontend Angular
# ================================

# ÉTAPE 1 : Construire l'application Angular
FROM node:18-alpine AS build

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances Node.js
RUN npm install --legacy-peer-deps

# Copier tout le code source
COPY . .

# Compiler Angular
RUN npm run build

# ================================
# ÉTAPE 2 : Servir avec Nginx
# ================================
FROM nginx:alpine

# Copier les fichiers compilés (outputPath = "dist" dans angular.json)
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
