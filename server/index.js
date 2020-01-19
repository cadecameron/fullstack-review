//////////////////////////////////////////////////////////////////////////////////////////
// SERVER ////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const getReposByUsername = require('../helpers/github.js').getReposByUsername;
const db = require('../database');
const bodyparser = require('body-parser');
const morgan = require('morgan');

let app = express();
let port = 1128;

//////////////////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE ////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

app.use(morgan('dev'));
app.use(bodyparser.text()); // testing w Postman using plain text
app.use(express.json());
//app.use(bodyparser.json()); // parses any reqs with application/json type

// Handle requests with invalid JSON req.body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // custom handler code for invalid JSON
    console.log(`Recieved invalid JSON object from client. Responding with code 400.`);
    res.status(400).send({
      code: 400,
      message: `Request body contents passed to /repos was invalid.
      If this isn't what you were expecting, make a GET request to the /repos endpoint with either a valid JSON object or a Github username as plain text in the body of your request.`,
      requestSent: JSON.stringify(req.body)
    });
  } else next();
});

app.use(express.static(__dirname + '/../client/dist'));

//////////////////////////////////////////////////////////////////////////////////////////
// ROUTES ////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

app.post('/repos', function (req, res) {
  // This route should take the github username provided
  // and get the repo information from the github API, then
  // save the repo information in the database

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
      res.status(201).end();
    });
  });
});

app.get('/repos', function (req, res) {
  // This route should send back the top 25 repos, based on the passed in criteria/filters
  //console.log(JSON.stringify(req.body));
  // criteria input validation (i.e. JSON is valid, etc)
  // if (!req.body || typeof req.body !== 'object' || typeof req.body != 'string') {
  //   console.log(`Criteria passed to /repos was a ${typeof req.body} with a value of ${req.body}.\n
  //   Fetching all repos with default criteria instead. \n
  //   If this isn't what you were expecting, make a GET request to the /repos endpoint with either a valid JSON object or a username as plain text in the body of your request.`);
  //   req.body = {};
  // }

  console.log(`Passing ${typeof req.body} ${JSON.stringify(req.body)} to getFiltered database function.`);
  // send criteria to getFiltered database lookup function
  db.getFiltered(req.body, (err, data) => {
    if (err) {
      console.log(`Error getting data back from getFiltered database function:`, err);
      res.status(403).end();
    }
    console.log(`Successfully retrived data from getFiltered database function. Length of returned data is ${data.length}`);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(data));
  });


});

//////////////////////////////////////////////////////////////////////////////////////////
// SERVER START //////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

app.listen(port, function () {
  console.log(`Express server started and listening on port ${port}.`);
});

