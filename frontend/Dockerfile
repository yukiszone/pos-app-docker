# Usa un'immagine di Node.js
FROM node:18-alpine

# Imposta la cartella di lavoro
WORKDIR /app

# Copia il package.json e installa le dipendenze
COPY package.json ./
RUN npm install

# Copia tutto il codice del frontend
COPY . .

# Esponi la porta di default di React
EXPOSE 3000

# Avvia l'applicazione in modalità sviluppo
CMD ["npm", "start"]