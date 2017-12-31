const express = require('express');
const app = express();
//Pour gérer la BDD mysql
var mysql = require('mysql');
var bodyParser = require('body-parser');
//Pour gérer les hashs
var hash = require('hash.js');
//Pour inclusion des fichiers
var fs = require("fs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'smt',
});

//Message d'accueil de l'API
app.get('/api', function (req, res) {
  res.send('Hello World!')
});

//Inclusion des fichiers
eval(fs.readFileSync("node/account.js") + '');
eval(fs.readFileSync("node/workout.js") + '');

//On écoute sur le port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!')
});

