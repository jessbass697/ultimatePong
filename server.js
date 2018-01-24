console.log('Server-side code running');

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');

const app = express();

// serve files from the public directory
app.use(express.static('public'));

//needed to parse JSON data in the body of POST requests
app.use(bodyParser.json());


//connect to the db and start the express server
let db;

const url = 'mongodb://jbass697:yoosintul@ds135866.mlab.com:35866/jbdb';

MongoClient.connect(url, (err, database) => {
    if(err) {
        return console.log(err);
    }
    db = database;
    // start the express web server listening on 8080
    app.listen(8080, () => {
        console.log('listening on 8080');
    });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/gamescore', (req, res) => {
    console.log(req);
    console.log("Request received", req.body);
    
    db.collection('scoring').save({
        score: 
        req.body['score'] 
    }, req.body, {
        upsert: true
    },
    (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log('score added to db');
        res.redirect('/');
    });
});

app.get('/gamescore', (req, res) => {
    db.collection('scoring').find().sort({score: -1}).limit(5).toArray(
    (err, result) => {
        if (err) return console.log(err);
        res.send(result);
    })
});