// Importa il modulo per la gestione degli errori HTTP
var createError = require('http-errors');
// Importa il framework Express
var express = require('express');
// Importa il modulo per la gestione dei percorsi dei file
var path = require('path');
// Importa il modulo per il parsing dei cookie
var cookieParser = require('cookie-parser');
// Importa il modulo per il logging delle richieste HTTP
var logger = require('morgan');

// Importa i router definiti nelle rispettive cartelle
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Crea l'applicazione Express
var app = express();

// Configurazione del motore di template (Handlebars)
app.set('views', path.join(__dirname, 'views')); // Imposta la cartella delle viste
app.set('view engine', 'hbs'); // Imposta Handlebars come motore di template

// Middleware per logging, parsing e gestione file statici
app.use(logger('dev')); // Log delle richieste HTTP in modalità sviluppo
app.use(express.json()); // Parsing del body in formato JSON
app.use(express.urlencoded({ extended: false })); // Parsing del body in formato URL-encoded
app.use(cookieParser()); // Parsing dei cookie
app.use(express.static(path.join(__dirname, 'public'))); // Servizio dei file statici dalla cartella public

// Definizione delle route principali
app.use('/', indexRouter); // Route principale
app.use('/users', usersRouter); // Route per /users

// Gestione degli errori 404 (pagina non trovata)
app.use(function(req, res, next) {
  next(createError(404)); // Passa l'errore 404 al gestore degli errori
});

// Gestore generale degli errori
app.use(function(err, req, res, next) {
  // Imposta variabili locali, mostra dettagli solo in ambiente di sviluppo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizza la pagina di errore con lo status appropriato
  res.status(err.status || 500);
  res.render('error');
});

// Esporta l'applicazione per l'utilizzo in altri file (ad esempio bin/www)
module.exports = app;
