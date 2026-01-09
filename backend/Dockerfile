# Usa un'immagine leggera di Node.js
FROM node:18-alpine

# Imposta la cartella di lavoro dentro il container
WORKDIR /app

# Copia il file delle dipendenze e installale
COPY package.json ./
RUN npm install

# Copia tutto il resto del codice sorgente
COPY . .

# Crea la cartella uploads se non esiste (utile per i permessi)
RUN mkdir -p uploads

# Esponi la porta su cui gira il server (definita in server.js)
EXPOSE 5000

# Comando per avviare il server
CMD ["npm", "start"]