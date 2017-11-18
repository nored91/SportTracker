const express = require('express');
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
  
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'smt',
});

//On se connecte à la BDD


  app.get('/api', function (req, res) {
    res.send('Hello World!')
  });


  app.get('/api/account/list', function (req, res) {

    var resultat = {resultat : 'NOK', data : [], message : ''};
    var reqSql = "SELECT * FROM account";

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

  app.post('/api/account/create', function (req, res) {
    var resultat = {resultat : 'NOK', data : null, message : ''};
    var id = null;
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

  app.listen(3000, function () {
    console.log('App listening on port 3000!')
  });

  