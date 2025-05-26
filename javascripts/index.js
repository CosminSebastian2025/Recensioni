// passw:1234

import axios from "axios";

var variabile = 0; // Variabile di utilità generica
var elem_post; // Array che conterrà i post recuperati dal backend
var numero_like = 0; // Numero di like per un post

var id_utente = 0; // ID dell'utente attualmente loggato
var id_post = 0; // ID del post selezionato

// Funzione asincrona per recuperare tutti i post dal backend
// Accetta come parametro l'id del post per cui mostrare le recensioni
async function getPosts(id) {
    try
    {
        // Effettua una richiesta GET all'endpoint /posts del backend per ottenere tutti i post
        const response = await axios.get(`http://localhost:3001/posts`); // Richiesta GET ai post
        console.log('--- POST ---');
        elem_post = response.data; // Salva i post ricevuti nell'array globale elem_post

        mostraRecensioni(id); // Chiama la funzione per mostrare le recensioni relative all'id specificato
    }
    catch (error) {
        // Gestisce eventuali errori nella richiesta
        console.error('Errore recuperando i post:', error); // Gestione errori
    }
}

// Mostra le recensioni relative a uno specifico id di post
// Prende l'id del post come parametro
function mostraRecensioni(id) {
    // Recupera il contenitore HTML dove verranno mostrate le recensioni, usando l'id dinamico
    const box = document.getElementById('recensioni-' + id); // Trova il contenitore HTML

    // Svuota il contenuto del box prima di aggiungere nuovi elementi
    box.innerHTML = '';

    // Crea una lista non ordinata per elencare le recensioni
    const ul = document.createElement("ul");

    // Cicla su tutti i post ricevuti dal backend
    for (let i = 0; i < elem_post.length; i++)
    {
        // Controlla se il post corrente corrisponde all'id richiesto (dopo averlo pulito)
        if(elem_post[i].id === pulisciId(id)) // Controlla se il post corrisponde all'id
        {
            // Crea un nuovo elemento <li> per la descrizione del post
            const li = document.createElement("li");
            li.textContent = elem_post[i].descrizione; // Inserisce la descrizione del post
            ul.appendChild(li);
        }

    }

    box.appendChild(ul);

    if (box.style.display === "none" || box.style.display === "") {
        box.style.display = "block";
    } else {
        box.style.display = "none";
    }
}

// Funzione asincrona per aggiungere una recensione a un post
async function aggiungiRecensione(id) {

    // Cerca il textarea usando l'ID dinamico
    const box = document.getElementById(id); // Usa il valore di id passato alla funzione
    var id_post = pulisciId(id);

    // Verifica se l'elemento è stato trovato
    if (!box) {
        console.error("Errore: il textarea con id:" + id + "' non è stato trovato.");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:3001/aggiungi`, {
            params:
                {
                    descrizione: box.value, // Contenuto della recensione
                    id: id_post // ID del post
                }
        });
        console.log('--- Risposta Aggiunta ---');
        console.log(response.data);
        elem_post = response.data; // Aggiorna l'array dei post
    } catch (error) {
        console.error('Errore recuperando i post:', error);
    }
}

// Funzione per gestire il login dell'utente
function accediLogin()
{
    const username = document.getElementById("username").value; // Recupera il valore dell'username
    const password = document.getElementById("password").value; // Recupera il valore della password

    usernameTrovato(username, password); // Verifica l'utente
    getLike(); // Recupera i like
}

// Funzione asincrona per verificare l'utente nel backend
async function usernameTrovato(username,password)
{
    try
    {
        const response = await axios.get(`http://localhost:3001/utente`, {
            params:
                {
                    user: username, // Username dell'utente
                    pass: password // Password dell'utente
                }
        });

        id_utente = response.data.id_utente; // Salva l'ID dell'utente

        if(response.data.utenti>0) // Se l'utente esiste
        {
            const login = document.getElementById("login-container");
            login.style.display = "none"; // Nasconde il contenitore del login

            const pagina = document.getElementById("tutto");
            pagina.style.display = 'block'; // Mostra la pagina principale
        }

    }
    catch (error) {
        console.error('Errore recuperando username:', error);
    }
}

// Funzione per recuperare i like per i post
function getLike()
{
    mostraLike("like1");
    mostraLike("like2");
    mostraLike("like3");
}

// Funzione asincrona per mostrare i like di un post
async function mostraLike(id)
{
    id_post = pulisciId(id); // Pulisce l'ID del post

    try
    {
        const response = await axios.get(`http://localhost:3001/mostraLike`, {
            params:
                {
                    id: id_post // ID del post
                }
        });

        numero_like = document.getElementById(id); // Recupera l'elemento HTML
        numero_like.innerText = response.data.likes; // Aggiorna il numero di like
    }
    catch (error) {
        console.error('Errore recuperando i post:', error);
    }
}

// Funzione asincrona per verificare se un like è già stato messo
async function likeMesso(id_post)
{
    try
   {
       const response = await axios.get(`http://localhost:3001/likePresente`, {
           params:
               {
                   id_u: id_utente, // ID dell'utente
                   id_p: parseInt(id_post), // ID del post
               }
       });

        console.log(response.data.likePresente); // Stampa il risultato
   }
   catch (error) {
       console.error('Errore recuperando i post:', error);
   }
}

// Funzione asincrona per recuperare le interazioni
async function getInterazioni() {
    try {
        const response = await axios.get(`http://localhost:3001/interazioni`);
    } catch (error) {
        console.error('Errore recuperando le interazioni:', error);
    }
}

// Funzione per aggiornare il cuore (like) di un post
async function refreshCuore(id,idPostUtente,idParagrafo)
{
    const img = document.getElementById(id); // Recupera l'immagine del cuore
    img.src = "./images/cuore_pieno.png"; // Imposta l'immagine del cuore pieno

    idPost = pulisciId(idPostUtente); // Pulisce l'ID del post

    let response;

    if (variabile == 0) // Se il like non è stato messo
    {
        try
        {
            response = await axios.get(`http://localhost:3001/aggiungiLike`, {
                params:
                    {
                        id: idPost // ID del post
                    }
            });
        } catch (error) {
            console.error('Errore recuperando i post:', error);
        }

        img.src = "./images/cuore_pieno.png"; // Imposta l'immagine del cuore pieno

        const like = document.getElementById(idParagrafo); // Recupera il paragrafo dei like
        like.innerText = (parseInt(like.innerText) + 1).toString(); // Incrementa il numero di like

        variabile = 1; // Aggiorna la variabile
    }
    else // Se il like è già stato messo
    {
        try
        {
            response = await axios.get(`http://localhost:3001/rimuoviLike`, {
                params:
                    {
                        id: idPost // ID del post
                    }
            });
        } catch (error) {
            console.error('Errore recuperando i post:', error);
        }

        img.src = "./images/cuore_vuoto.png"; // Imposta l'immagine del cuore vuoto

        const like = document.getElementById(idParagrafo); // Recupera il paragrafo dei like
        like.innerText = (parseInt(like.innerText) - 1).toString(); // Decrementa il numero di like
        variabile = 0; // Aggiorna la variabile
    }

    elem_post = response.data; // Aggiorna l'array dei post
}

// Funzione per pulire l'ID di un elemento
function pulisciId(id) {
    const match = id.match(/\d+$/); // Cerca una sequenza di cifre alla fine della stringa
    return match ? match[0] : ""; // Restituisce l'ID pulito
}

