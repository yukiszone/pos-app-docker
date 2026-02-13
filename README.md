# POS System (Dockerized)

## Descrizione del Progetto
Questa applicazione è un sistema gestionale completo per punti cassa (Point of Sale), progettato per essere utilizzato in contesti come sagre, eventi, bar o piccole attività. L'architettura è basata su microservizi containerizzati tramite Docker, garantendo facilità di installazione e isolamento dell'ambiente.

Il sistema è composto da tre servizi principali:
1. Frontend: Interfaccia utente reattiva sviluppata in React.
2. Backend: API RESTful sviluppata in Node.js ed Express.
3. Database: MongoDB per la persistenza dei dati.

## Funzionalità Principali

### Interfaccia di Vendita (POS)
- Visualizzazione prodotti a griglia con immagini.
- Filtro rapido per Categoria/Evento (es. Bar, Cucina, Extra).
- Carrello interattivo con calcolo automatico del totale.
- Possibilità di incrementare, decrementare o rimuovere articoli dal carrello.
- Layout responsive adattabile a schermi touch e desktop.

### Gestione Prodotti
- Pannello di amministrazione dedicato.
- Operazioni CRUD (Create, Read, Update, Delete) sui prodotti.
- Caricamento immagini prodotti (salvate localmente).
- Gestione prezzi e assegnazione categorie.

### Reportistica
- Riepilogo vendite delle ultime 24 ore.
- Visualizzazione tabellare di quantita e ricavi per prodotto.
- Esportazione dei dati in formato Excel (.xlsx).
- Funzione di reset per azzerare lo storico vendite giornaliero.

## Requisiti di Sistema
- Docker Desktop (o Docker Engine + Docker Compose) installato sulla macchina.
- Git (per clonare il repository).

## Installazione e Avvio

1. Clonare il repository:  
   git clone https://github.com/yukiszone/pos-app-docker.git  
   cd pos-app-docker

2. Costruire e avviare i container:  
   Eseguire il comando nella root del progetto (dove si trova il file docker-compose.yml):  
   docker-compose up --build  

   Nota: Al primo avvio potrebbe essere necessario attendere qualche minuto per il download delle immagini e l'installazione delle dipendenze.

3. Accesso all'applicazione:
   - Frontend (Interfaccia Utente): http://localhost:3000  
   - Backend (API Status): http://localhost:5000

4. Arrestare l'applicazione:
   Premere CTRL+C nel terminale oppure eseguire:  
   docker-compose down

## Struttura del Progetto

/ (root)  
├── docker-compose.yml&emsp;# Orchestrazione dei servizi  
├── .gitignore&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# File esclusi da Git  
├── .github/workflows&emsp;&emsp; # Pipeline CI/CD  
├── backend/&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# Codice sorgente Server (Node.js)  
│   ├── server.js&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# Entry point e logica API  
│   ├── models/&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# Schemi MongoDB  
│   └── uploads/&emsp;&emsp;&emsp;&emsp;&emsp;   # Cartella persistenza immagini  
└── frontend/&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# Codice sorgente Client (React)  
&emsp;├── src/&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# Componenti React e stili  
&emsp;└── public/&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;# Assets statici  

## Integrazione Continua (CI)
Il repository include una configurazione per GitHub Actions (.github/workflows/main.yml).
Ad ogni push sul branch 'main', il sistema esegue automaticamente una build di prova dei container Docker per verificare l'integrità del codice e prevenire errori di distribuzione.

## Stack Tecnologico
- Frontend: React.js, Bootstrap 5, Axios.
- Backend: Node.js, Express.js, Multer (gestione file).
- Database: MongoDB.
- Utilities: XLSX (export Excel).
- DevOps: Docker, Docker Compose, GitHub Actions.

## Risoluzione Problemi Comuni

- Errore "Network Error" nel Frontend:  
  Assicurarsi che il container del backend sia attivo. Controllare i log con: docker logs pos_backend

- Immagini non visibili:  
  Verificare che la cartella 'uploads' esista nella root del progetto e che i permessi di scrittura siano corretti.

- Database non connesso:  
  Il backend include un sistema di riconnessione automatica. Attendere 10-15 secondi all'avvio affinché MongoDB sia pronto.
