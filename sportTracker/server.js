const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/accout/list', function (req, res) {
  var result = {
    resultat : 'OK', 
    data : { 
    0 : {id: 1, name: 'Mr. Nice' ,mdp: 'test', email: 'test@test.fr' },
    1 : {id: 2, name: 'Mr. Bad' ,mdp: 'test2', email: 'test2@test.fr' }
    }
  };
  res.json(result);
})

app.get('/accout/insert/*', function (req, res) {
  var result = {resultat : 'OK', message : 'Insertion réussie'};
  res.json(result);
});



app.listen(3000, function () {
  console.log('App listening on port 3000!')
});