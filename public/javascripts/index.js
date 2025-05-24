// passw:1234

var variabile = 0;
var elem_post;
var numero_like = 0;

var id_utente = 0;
var id_post = 0;


async function getPosts(id) {
    try
    {
        const response = await axios.get(`http://localhost:3001/posts`);
        console.log('--- POST ---');
        elem_post = response.data;

        mostraRecensioni(id);
    }
    catch (error) {
        console.error('Errore recuperando i post:', error);
    }
}

function mostraRecensioni(id) {
    const box = document.getElementById('recensioni-' + id);

    // Svuota il contenuto prima di aggiungere nuovi elementi
    box.innerHTML = '';

    // Crea la lista non ordinata
    const ul = document.createElement("ul");

    for (let i = 0; i < elem_post.length; i++)
    {
        if(elem_post[i].id == pulisciId(id))
        {
            const li = document.createElement("li");
            li.textContent = elem_post[i].descrizione;
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


async function aggiungiRecensione(id) {

    // Cerca il textarea usando l'ID dinamico
    const box = document.getElementById(id); // Usa il valore di id passato alla funzione
    var id_post = pulisciId(id);

    // Verifica se l'elemento è stato trovato
    if (!box) {
        console.error("Errore: il textarea con id:" + id + "' non è stato trovato.");
        return;
    }

    // Stampa il valore del textarea
    // console.log("Contenuto del textarea:", box.value);

    try {
        const response = await axios.get(`http://localhost:3001/aggiungi`, {
            params:
                {
                    descrizione: box.value,
                    id: id_post
                }
        });
        console.log('--- Risposta Aggiunta ---');
        console.log(response.data);
        elem_post = response.data;
    } catch (error) {
        console.error('Errore recuperando i post:', error);
    }
}


function accediLogin()
{
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // console.log(username, password);

    usernameTrovato(username, password);
    getLike();
}


async function usernameTrovato(username,password)
{
    try
    {
        const response = await axios.get(`http://localhost:3001/utente`, {
            params:
                {
                    user: username,
                    pass: password
                }
        });


        console.log("id_utente:"+response.data.id_utente);

        id_utente = response.data.id_utente;

        if(response.data.utenti>0)
        {
            const login = document.getElementById("login-container");
            login.style.display = "none";

            const pagina = document.getElementById("tutto");
            pagina.style.display = 'block';

        }

    }
    catch (error) {
        console.error('Errore recuperando username:', error);
    }




}


function getLike()
{
    mostraLike("like1");
    mostraLike("like2")
    mostraLike("like3")
}

async function mostraLike(id)
{

    id_post = pulisciId(id);


    try
    {
        const response = await axios.get(`http://localhost:3001/mostraLike`, {
            params:
                {
                    id: id_post
                }
        });

        //console.log(response.data);


        numero_like = document.getElementById(id);
        numero_like.innerText = response.data.likes;

    }
    catch (error) {
        console.error('Errore recuperando i post:', error);
    }



}

async function likeMesso(id_post)
{
    try
   {
       const response = await axios.get(`http://localhost:3001/likePresente`, {
           params:
               {
                   id_u: id_utente,
                   id_p: parseInt(id_post),
               }
       });

        //console.log(id_utente + " "+ id_post );
        console.log(response.data.likePresente);
   }
   catch (error) {
       console.error('Errore recuperando i post:', error);
   }
}



async function getInterazioni() {
    try {
        const response = await axios.get(`http://localhost:3001/interazioni`);
        //console.log('--- INTERAZIONI ---');
        //console.log(response.data);
    } catch (error) {
        console.error('Errore recuperando le interazioni:', error);
    }
}


async function refreshCuore(id,idPostUtente,idParagrafo)
{
    const img = document.getElementById(id);
    img.src = "./images/cuore_pieno.png";

    idPost = pulisciId(idPostUtente);

    let response;

    console.log("variabile:"+variabile);

    if (variabile == 0)
    {
        try
        {
            response = await axios.get(`http://localhost:3001/aggiungiLike`, {
                params:
                    {
                        id: idPost
                    }
            });
        } catch (error) {
            console.error('Errore recuperando i post:', error);
        }


        img.src = "./images/cuore_pieno.png";

        const like = document.getElementById(idParagrafo);
        like.innerText = (parseInt(like.innerText) + 1).toString();

        variabile = 1;
    }
    else
    {
        try
        {
            response = await axios.get(`http://localhost:3001/rimuoviLike`, {
                params:
                    {
                        id: idPost
                    }
            });
        } catch (error) {
            console.error('Errore recuperando i post:', error);
        }

        img.src = "./images/cuore_vuoto.png";

        const like = document.getElementById(idParagrafo);
        like.innerText = (parseInt(like.innerText) - 1).toString();
        variabile = 0;
    }

    elem_post = response.data;
}



function pulisciId(id) {
    const match = id.match(/\d+$/); // cerca una sequenza di cifre alla fine della stringa
    return match ? match[0] : "";
}




