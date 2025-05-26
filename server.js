// Importa il framework Express
const express = require('express');
// Importa il pacchetto CORS per abilitare le richieste cross-origin
const cors = require('cors'); // Importa il pacchetto CORS
// Importa il modulo Pool di pg per la connessione a PostgreSQL
const { Pool } = require('pg');
const app = express();
const PORT = 3001; // Porta su cui il server ascolterà le richieste

// Configura CORS per consentire richieste solo dal frontend su http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000', // Consente solo richieste da questo dominio
}));

// Configura la connessione a PostgreSQL
const pool = new Pool({
    user: 'postgres', // Username del database
    host: 'localhost', // Host del database
    database: 'database_app', // Nome del database
    password: '', // Password dell'utente (vuota in questo caso)
    port: 5432, // Porta predefinita di PostgreSQL
});

// Test di connessione al database all'avvio del server
pool.connect((err, client, release) => {
    if (err) {
        // Se c'è un errore di connessione, lo stampa in console
        return console.error('Errore di connessione al database', err.stack);
    }
    console.log('Connesso a PostgreSQL!');
    release(); // Rilascia il client al pool
});

// Endpoint GET per leggere tutti i post
app.get('/posts', async (req, res) => {
    try {
        // Esegue una query per ottenere tutti i post
        const result = await pool.query('SELECT * FROM post');
        res.json(result.rows); // Restituisce i risultati come JSON
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query', err.stack);
        res.status(500).send('Errore del server');
    }
});

// Endpoint GET per aggiungere una descrizione (e il corrispondente id) oppure leggere tutti i post
app.get('/aggiungi', async (req, res) => {
    var id = req.query.id; // Recupera l'id dalla query string
    var descrizione = req.query.descrizione; // Recupera la descrizione dalla query string

    try {
        if (id && descrizione)
        {
            // Se sono passati id e descrizione, esegue una INSERT
            await pool.query(
                'INSERT INTO post (id, descrizione) VALUES ($1, $2)',
                [id, descrizione]
            );
            res.send('Nuovo post inserito con successo');
        } else {
            // Se non ci sono parametri, esegue una SELECT per tutti i post
            const result = await pool.query('SELECT * FROM post');
            res.json(result.rows);
        }
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query', err.stack);
        res.status(500).send('Errore del server');
    }
});

// Endpoint GET per leggere tutte le interazioni
app.get('/interazioni', async (req, res) => {
    try {
        // Esegue una query per ottenere tutte le interazioni
        const result = await pool.query('SELECT * FROM interazioni');
        res.json(result.rows); // Restituisce i risultati come JSON
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query', err.stack);
        res.status(500).send('Errore del server');
    }
});

// Endpoint GET per mostrare il numero di like di un post
app.get('/mostraLike', async (req, res) => {
    const postId = req.query.id; // Recupera l'id del post dalla query string
    if (!postId) {
        // Se manca l'id, restituisce errore 400
        return res.status(400).send('Missing post ID');
    }

    try {
        // Conta i like per il post specificato
        const result = await pool.query(
            'SELECT COUNT(utente_id) FROM interazioni i WHERE i.post_id = $1  AND i.is_like is TRUE ',
            [postId]
        );
        res.json({ likes: result.rows[0].count }); // Restituisce il conteggio dei like
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});

// Endpoint GET per aggiungere un like a un post
app.get('/aggiungiLike', async (req, res) => {
    const postId = req.query.id; // Recupera l'id del post dalla query string
    if (!postId) {
        // Se manca l'id, restituisce errore 400
        return res.status(400).send('Missing post ID');
    }

    try {
        // Inserisce una nuova interazione di tipo like per il post
        const result = await pool.query(
            'INSERT INTO interazioni (is_like,utente_id,post_id) VALUES (TRUE,1,$1)',
            [postId]
        );

        res.json(result.rows); // Restituisce la risposta della query
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});

// Endpoint GET per rimuovere un like da un post
app.get('/rimuoviLike', async (req, res) => {
    const postId = req.query.id; // Recupera l'id del post dalla query string
    if (!postId) {
        // Se manca l'id, restituisce errore 400
        return res.status(400).send('Missing post ID');
    }

    try {
        // Elimina una sola interazione di tipo like per il post specificato
        const result = await pool.query(
            `
            DELETE FROM interazioni
            WHERE ctid IN (
                SELECT ctid
                FROM interazioni
                WHERE post_id = $1 AND is_like IS TRUE
                LIMIT 1
            )
            `,
            [postId]
        );

        res.json({ deleted: result.rowCount }); // Restituisce il numero di like rimossi
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});

// Endpoint GET per autenticazione utente
app.get('/utente', async (req, res) => {
    const user = req.query.user; // Recupera lo username dalla query string
    const pass = req.query.pass; // Recupera la password dalla query string

    try {
        // Esegue una query per verificare se esiste un utente con username e password forniti
        const result = await pool.query(
            `
                SELECT COUNT(*) AS count
                FROM utenti u
                WHERE u.username = $1 AND u.password = $2
            `,
            [user,pass]
        );

        res.json({ utenti: result.rows[0].count }); // Restituisce 1 se utente trovato, 0 altrimenti
    } catch (err) {
        // Gestione degli errori di query
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});

// Avvio del server sulla porta specificata
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`); // Messaggio di avvio
});

