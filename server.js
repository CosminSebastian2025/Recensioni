const express = require('express');
const cors = require('cors'); // Importa il pacchetto CORS
const { Pool } = require('pg');
const app = express();
const PORT = 3001;

// Configura CORS per consentire richieste da http://localhost:3000
app.use(cors({
    origin: 'http://localhost:3000', // Consente solo richieste da questo dominio
}));

// Configura la connessione a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_app',
    password: '',
    port: 5432, // di solito 5432 per PostgreSQL
});

// Test connessione
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Errore di connessione al database', err.stack);
    }
    console.log('Connesso a PostgreSQL!');
    release();
});

// GET per leggere tutti i post
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM post');
        res.json(result.rows);
    } catch (err) {
        console.error('Errore nella query', err.stack);
        res.status(500).send('Errore del server');
    }
});

//aggiungi una descrizione (e il corrispondente id)
app.get('/aggiungi', async (req, res) => {
    var id = req.query.id;
    var descrizione = req.query.descrizione;

    try {
        if (id && descrizione)
        {
            // Se sono passati id e descrizione, faccio INSERT
            await pool.query(
                'INSERT INTO post (id, descrizione) VALUES ($1, $2)',
                [id, descrizione]
            );
            res.send('Nuovo post inserito con successo');
        } else {
            // Se non ci sono parametri, faccio il SELECT normale
            const result = await pool.query('SELECT * FROM post');
            res.json(result.rows);
        }
    } catch (err) {
        console.error('Errore nella query', err.stack);
        res.status(500).send('Errore del server');
    }
});




// GET per leggere tutte le interazioni
app.get('/interazioni', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM interazioni');
        res.json(result.rows);
    } catch (err) {
        console.error('Errore nella query', err.stack);
        res.status(500).send('Errore del server');
    }
});


app.get('/mostraLike', async (req, res) => {
    const postId = req.query.id;
    if (!postId) {
        return res.status(400).send('Missing post ID');
    }

    try {
        const result = await pool.query(
            'SELECT COUNT(utente_id) FROM interazioni i WHERE i.post_id = $1  AND i.is_like is TRUE ',
            [postId]
        );
        res.json({ likes: result.rows[0].count });
    } catch (err) {
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});

app.get('/aggiungiLike', async (req, res) => {
    const postId = req.query.id;
    if (!postId) {
        return res.status(400).send('Missing post ID');
    }

    try {
        const result = await pool.query(
            'INSERT INTO interazioni (is_like,utente_id,post_id) VALUES (TRUE,1,$1)',
            [postId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});

app.get('/rimuoviLike', async (req, res) => {
    const postId = req.query.id;
    if (!postId) {
        return res.status(400).send('Missing post ID');
    }

    try {
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

        res.json({ deleted: result.rowCount });
    } catch (err) {
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});


app.get('/utente', async (req, res) => {

    const user = req.query.user;
    const pass = req.query.pass;

    try {
        const result = await pool.query(
            `
                SELECT COUNT(*) AS count
                FROM utenti u
                WHERE u.username = $1 AND u.password = $2    
            `,
            [user,pass]
        );

        res.json({ utenti: result.rows[0].count });
    } catch (err) {
        console.error('Errore nella query:', err);
        res.status(500).send('Errore del server');
    }
});


// Avvio del server
app.listen(PORT, () => {
    console.log(`Server in ascolto su http://localhost:${PORT}`);
});
