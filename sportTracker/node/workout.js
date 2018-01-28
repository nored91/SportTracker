
//Pour uploader une image sur un compte
app.post('/api/workout/upload', function (req, res) {
    var resultat = {resultat : 'NOK', data : null, message : 'l\'upload à échoué'};
    if(req.files.photo.data && req.body.id){
        var ext = req.files.photo.name.substr(req.files.photo.name.length-3,3);
        if(ext == 'jpg' || ext == 'png' || ext == 'JPG' || ext == 'PNG'){
        var b64 = "data:image/" + ext + ";base64, " + new Buffer(req.files.photo.data).toString("base64");
        //On insère les valeurs
        con.query("UPDATE account SET photo = ? where id = ?",[b64,req.body.id], function (error, results, fields) {
            if (error){
            resultat.message = error;
            } 
            else{
            resultat.data = b64;
            resultat.message = "L'upload est un succès";
            resultat.resultat = "OK";
            }
            res.json(resultat);
        });
        }
        else{
        resultat.message = "Extension de fichier incorrect";
        res.json(resultat);
        }
    }
    else{
        res.json(resultat);
    }
})

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
    
  });
  
  //Crée une seance en BDD avec les valeurs transmises
  app.post('/api/workout/create', function (req, res) {
    var resultat = {resultat : 'NOK', data : null, message : ''};
    var id = null;
  
    //On insère les valeurs
    con.query('INSERT INTO workout SET ?', req.body, function (error, results, fields) {
      if (error){
        resultat.message = error;
        res.json(resultat);
        console.log(error);
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
  app.post('/api/workout/update', function (req, res) {
    var resultat = {resultat : 'NOK', data : null, message : ''};
    var id = null;
  
    //Nouveau mdp à hasher
    if(req.body.isMdpChange){
      req.body.mdp = hash.sha256().update(req.body.mdp).digest('hex');
    }
  
    //On insère les valeurs
    con.query("UPDATE workout SET name = ?, resume = ?, description = ?, typeSport = ? , duration = ? , feeling = ?  , date = ? where id = ?",[req.body.name,req.body.resume,req.body.description,req.body.typeSport,req.body.duration,req.body.feeling,req.body.date,req.body.id], function (error, results, fields) {
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
  app.post('/api/workout/delete', function (req, res) {
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
  app.get('/api/workout/:id', function (req, res) {
    var resultat = {resultat : 'NOK', data : null, message : ''};
    var reqSql = "SELECT * FROM workout WHERE id = ?";
  
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
          resultat.message = "Aucune séance avec cet identifiant";
        }
        
      }
      res.json(resultat);
    });
  });