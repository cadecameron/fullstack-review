const express = require('express');
const getReposByUsername = require('../helpers/github.js').getReposByUsername;
const db = require('../database');
const bodyparser = require('body-parser');
const morgan = require('morgan');
let app = express();
let port = 1128;


app.use(morgan('dev'));
app.use(bodyparser.text()); // testing w Postman using plain text
app.use(bodyparser.json());
app.use(express.static(__dirname + '/../client/dist'));

app.post('/repos', function (req, res) {
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database
  // console.log(req.body);

  console.log(`Passing ${req.body} to getReposByUsername helper function.`);

  getReposByUsername(req.body, (err, data) => {
    if (err) {
      console.log('Error getting response from remote API server:', err);
      res.status(403).end();
      return;
    }

    console.log('Recieved data from getReposByUsername function of length:', data.length, '. Sending off to database');

    db.save(data, (err, data) => {
      if (err) {
        console.log('Error saving records to the database:', err);
        res.status(403).end();
        return;
      }

      res.status(201).send(JSON.stringify(data));
    });
  });
});

app.get('/repos', function (req, res) {
  // This route should send back the top 25 repos, based on the passed in criteria/filters
  console.log(`Passing ${req.body} to getFiltered database function.`);
  db.getFiltered(req.body)
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});

