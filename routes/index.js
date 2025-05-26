// Importa il modulo Express, necessario per creare router e gestire le route
var express = require('express');
// Crea un nuovo router utilizzando Express
var router = express.Router();

/*
  Route GET per la home page.
  Se vuoi mostrare la pagina di login come home, decommenta la funzione qui sotto e commenta la successiva.
  Questa funzione renderizza la vista 'login.hbs' con il titolo 'Express'.
*/
/*router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});*/

/*
  Route GET per la home page.
  Questa funzione renderizza la vista 'index.hbs' con il titolo 'Express'.
  Viene utilizzata come home page principale dell'applicazione.
*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Esporta il router per poterlo utilizzare in app.js o in altri file
module.exports = router;
