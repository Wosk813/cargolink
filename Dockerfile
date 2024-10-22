FROM node:18-alpine

# Instalacja niezbędnych pakietów do kompilacji
RUN apk add --no-cache python3 make g++ linux-headers

WORKDIR /app

# Kopiowanie plików package
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty aplikacji
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]