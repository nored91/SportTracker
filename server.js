
    /*eslint-disable*/
    var express = require('express');
    var multer = require('multer');
    var fs = require('fs');
    var app = express();
    var path = require('path')
     
    var DIR = './uploads/';
    var storage = multer.diskStorage({
        destination: DIR,
        filename: function(req, file, cb) {
            cb(null, Date.now() + '_' + file.originalname)
        }
    });

    var upload = multer({ storage: storage}).single('file');


    app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
      res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.header('Access-Control-Allow-Credentials', true);
      next();
    });

    app.options('/api', function (req, res) {
      res.end('ok');
    });

    app.get('/api', function (req, res) {
      res.end('file catcher example');
    });
     
    app.post('/api', function (req, res) {
      upload(req, res, function (err) {
        if (err) {
          return res.end(err.toString());
        }
        res.end('ok-' + req.file.filename);
      });
    });
     
    var PORT = process.env.PORT || 3000;
     
    app.listen(PORT, function () {
      console.log('Working on port ' + PORT);
    });

