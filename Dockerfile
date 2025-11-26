# Etapa 1: Build
FROM node:18-alpine AS build-stage

WORKDIR /app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código e compila
COPY . .
RUN npm run build

# Etapa 2: Produção
FROM nginx:1.25-alpine AS production-stage

# Remove configuração default e adiciona a sua
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia apenas os arquivos compilados
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]