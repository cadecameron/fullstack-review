const request = require('request');
const config = require('../config.js');
const API_URL = 'https://api.github.com/users/' // {username}

let getReposByUsername = (username, callback) => {
  // TODO - Use the request module to request repos for a specific
  // user from the github API

  // The options object has been provided to help you out,
  // but you'll have to fill in the URL
  let options = {
    url: `${API_URL}${username}/repos`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${config.TOKEN}`
    }
  };

  request(options, (err, res, body) => {
    console.log(`Recieved a statusCode from GitHub of ${res.statusCode}`);
    if (err) {
      callback(err);
    } else if (res.statusCode == 200) {
      var data = JSON.parse(body);
      callback(null, data);
    } else if (res.statusCode >= 400 && res.statusCode <= 499) {
      callback(new Error('GitHub user not found!'));
    } else {
      callback(null, 'Something went wrong with Github');
    }

  })

}

module.exports.getReposByUsername = getReposByUsername;