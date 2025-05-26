// Importa il modulo Express, necessario per creare router e gestire le route
var express = require('express');
// Crea un nuovo router utilizzando Express
var router = express.Router();

/*
  Route GET per la lista degli utenti.
  Questa route risponde a richieste GET sull'endpoint '/users'.
  Quando viene chiamata, restituisce una semplice stringa di risposta.
*/
router.get('/', function(req, res, next) {
  res.send('respond with a resource'); // Risposta testuale per la route /users
});

// Esporta il router per poterlo utilizzare in app.js o in altri file
module.exports = router;
