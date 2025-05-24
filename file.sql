

-- Creazione della tabella utenti
CREATE TABLE IF NOT EXISTS utenti (
                                      id SERIAL PRIMARY KEY,
                                      username TEXT NOT NULL UNIQUE,
                                      password TEXT NOT NULL
);

-- Creazione della tabella post con id_post come chiave primaria
CREATE TABLE IF NOT EXISTS post (
                                    id INTEGER,  -- Campo opzionale, non auto-incrementato
                                    id_post SERIAL PRIMARY KEY,
                                    descrizione TEXT,
                                    immagine_url TEXT,
                                    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione della tabella interazioni con riferimento a id_post
CREATE TABLE IF NOT EXISTS interazioni (
                                           id SERIAL PRIMARY KEY,
                                           utente_id INTEGER NOT NULL,
                                           post_id INTEGER NOT NULL,
                                           is_like BOOLEAN DEFAULT FALSE,
                                           commento TEXT,
                                           data TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                                           FOREIGN KEY (utente_id) REFERENCES utenti(id),
                                           FOREIGN KEY (post_id) REFERENCES post(id_post)
);

-- Inserimento dati di esempio nella tabella utenti
INSERT INTO utenti (username, password) VALUES
                                            ('mario_rossi', 'password123'),
                                            ('giuseppe_verdi', 'password456'),
                                            ('lucia_bianchi', 'password789');

-- Inserimento dati di esempio nella tabella post
INSERT INTO post (id, descrizione, immagine_url) VALUES
                                                             (1,  'Un meraviglioso tramonto di montagna', '/images/montagna_1.jpg'),
                                                             (2, 'Un''avventura tra le cime innevate', '/images/montagna_2.jpg'),
                                                             (3,  'La prima luce del giorno sulle vette', '/images/montagna_3.jpg');

-- Inserimento dati di esempio nella tabella interazioni
-- Nota: usa i valori effettivi di id_post se necessario, altrimenti presumi 1, 2, 3
INSERT INTO interazioni (utente_id, post_id, is_like, commento) VALUES
                                                                 (1, 1, TRUE, NULL),  -- Mario Rossi ha messo like al primo post
                                                                 (2, 1, FALSE, 'Bellissima vista!'),
                                                                 (3, 1, TRUE, 'Post fantastico!'),
                                                                 (1, 2, FALSE, 'Molto suggestiva la fotografia.'),
                                                                 (2, 2, TRUE, NULL);
