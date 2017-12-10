const express = require('express');
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var hash = require('hash.js')

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

//Liste les comptes en BDD
app.post('/api/account/list', function (req, res) {

  var resultat = {resultat : 'NOK', data : [], message : ''};
  var reqSql = "SELECT * FROM account";

  if(req.body.filter != ""){
    reqSql = reqSql + " WHERE " + req.body.filter;
  }
  if(req.body.orderby != ""){
    reqSql = reqSql + " ORDER BY " + req.body.orderby;
  }
  
  con.query(reqSql, function (err, result) {
    //Si on a une erreur lors de l'execution de la requête
    if (err) {
      resultat.message = err;
    }
    
    //Si on a des résultat on renvoie les données
    if(result){
      resultat.resultat = 'OK';
      result.forEach(function(row) {
        resultat.data.push(row);
      });
    }
    //Si aucun résultat
    else{
      resultat.message = "Aucun résultat";
      
    }
    res.json(resultat);
  });
  
})

//Crée un compte en BDD avec les valeurs transmises
app.post('/api/account/create', function (req, res) {
  var resultat = {resultat : 'NOK', data : null, message : ''};
  var id = null;

  //On hash le mot de passe en sha256
  req.body.mdp = hash.sha256().update(req.body.mdp).digest('hex');

  //On insère les valeurs
  con.query('INSERT INTO account SET ?', req.body, function (error, results, fields) {
    if (error){
      resultat.message = error;
      res.json(resultat);
    } 
    else{
      id = results.insertId;
      resultat.data = req.body;
      resultat.data.id = id;
      resultat.resultat = 'OK';
      res.json(resultat);
    }
  });
});

//Met à jour un compte en BDD avec les valeurs transmises
app.post('/api/account/update', function (req, res) {
  var resultat = {resultat : 'NOK', data : null, message : ''};
  var id = null;

  //Nouveau mdp à hasher
  if(req.body.isMdpChange){
    req.body.mdp = hash.sha256().update(req.body.mdp).digest('hex');
  }

  //On insère les valeurs
  con.query("UPDATE account SET name = ?, surname = ?, email = ?, mdp = ? , verify = ? , rights = ? where id = ?",[req.body.name,req.body.surname,req.body.email,req.body.mdp,req.body.verify,req.body.rights,req.body.id], function (error, results, fields) {
    if (error){
      resultat.message = error;
      res.json(resultat);
    } 
    else{
      resultat.data = req.body;
      resultat.resultat = 'OK';
      res.json(resultat);
    }
  });
});

//Met à jour un compte en BDD avec les valeurs transmises
app.post('/api/account/delete', function (req, res) {
  var resultat = {resultat : 'NOK', data : null, message : ''};
  var id = null;

  //On supprime le compte
  con.query("DELETE FROM account WHERE id = ?",[req.body.id], function (error, results, fields) {
    if (error){
      resultat.message = error;
      res.json(resultat);
    } 
    else{
      resultat.resultat = 'OK';
      res.json(resultat);
    }
  });
});


//Récupère le compte en BDD via l'ID transmis
app.get('/api/account/:id', function (req, res) {
  var resultat = {resultat : 'NOK', data : null, message : ''};
  var reqSql = "SELECT * FROM account WHERE id = ?";

  con.query(reqSql, [req.params.id], function (error, results, fields) {
    if (error){
      resultat.message = error;
    } 
    else{
      if(results.length != 0){
        resultat.resultat = 'OK';
        resultat.data = results[0];
      }
      else{
        resultat.message = "Aucun compte avec cet identifiant";
      }
      
    }
    res.json(resultat);
  });
});

//Renvoie le HASH sha256 de la valeur envoyé
app.post('/api/hash/', function (req, res) {
  var resultat = {resultat : 'NOK', data : null, message : ''};
  resultat.data = hash.sha256().update(req.body.data).digest('hex');
  res.json(resultat);
})

//On écoute sur le port 3000
app.listen(3000, function () {
  console.log('App listening on port 3000!')
});

