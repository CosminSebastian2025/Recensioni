-- Creazione della tabella utenti
CREATE TABLE IF NOT EXISTS utenti (
    id SERIAL PRIMARY KEY, -- Identificativo univoco auto-incrementato per ogni utente
    username TEXT NOT NULL UNIQUE, -- Username dell'utente, deve essere unico
    password TEXT NOT NULL -- Password dell'utente
);

-- Creazione della tabella post con id_post come chiave primaria
CREATE TABLE IF NOT EXISTS post (
    id INTEGER,  -- Campo opzionale, può essere usato come riferimento esterno o per ordinamento
    id_post SERIAL PRIMARY KEY, -- Identificativo univoco auto-incrementato per ogni post
    descrizione TEXT, -- Testo descrittivo del post
    immagine_url TEXT, -- Percorso o URL dell'immagine associata al post
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Data e ora di creazione del post
);

-- Creazione della tabella interazioni con riferimento a id_post
CREATE TABLE IF NOT EXISTS interazioni (
    id SERIAL PRIMARY KEY, -- Identificativo univoco auto-incrementato per ogni interazione
    utente_id INTEGER NOT NULL, -- Riferimento all'utente che ha interagito (FK su utenti)
    post_id INTEGER NOT NULL, -- Riferimento al post su cui si interagisce (FK su post)
    is_like BOOLEAN DEFAULT FALSE, -- TRUE se è un like, FALSE se è un commento o nessuna reazione
    commento TEXT, -- Testo del commento, se presente
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data e ora dell'interazione

    FOREIGN KEY (utente_id) REFERENCES utenti(id), -- Vincolo di chiave esterna su utenti
    FOREIGN KEY (post_id) REFERENCES post(id_post) -- Vincolo di chiave esterna su post
);

-- Inserimento dati di esempio nella tabella utenti
INSERT INTO utenti (username, password) VALUES
    ('mario_rossi', 'password123'), -- Utente 1
    ('giuseppe_verdi', 'password456'), -- Utente 2
    ('lucia_bianchi', 'password789'); -- Utente 3

-- Inserimento dati di esempio nella tabella post
INSERT INTO post (id, descrizione, immagine_url) VALUES
    (1,  'Un meraviglioso tramonto di montagna', '/images/montagna_1.jpg'), -- Post 1
    (2, 'Un''avventura tra le cime innevate', '/images/montagna_2.jpg'), -- Post 2
    (3,  'La prima luce del giorno sulle vette', '/images/montagna_3.jpg'); -- Post 3

-- Inserimento dati di esempio nella tabella interazioni
-- Nota: usa i valori effettivi di id_post se necessario, altrimenti presumi 1, 2, 3
INSERT INTO interazioni (utente_id, post_id, is_like, commento) VALUES
    (1, 1, TRUE, NULL),  -- Mario Rossi ha messo like al primo post
    (2, 1, FALSE, 'Bellissima vista!'), -- Giuseppe Verdi ha commentato il primo post
    (3, 1, TRUE, 'Post fantastico!'), -- Lucia Bianchi ha messo like e commentato il primo post
    (1, 2, FALSE, 'Molto suggestiva la fotografia.'), -- Mario Rossi ha commentato il secondo post
    (2, 2, TRUE, NULL); -- Giuseppe Verdi ha messo like al secondo post
