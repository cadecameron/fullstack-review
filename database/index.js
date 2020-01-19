const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/fetcher', {
  useMongoClient: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('Connected to MongoDB!'));

// define database schema
let repoSchema = mongoose.Schema({
  id: Number,
  name: String,
  owner: {
    login: String,
    id: Number,
    avatar_url: String,
    html_url: String
  },
  html_url: String,
  description: String,
  created_at: Date,
  updated_at: Date,
  watchers_count: Number,
  forks_count: Number,
  open_issues_count: Number,
  forks_count: Number,
  open_issues: Number,
  watchers: Number,
});

// create new Repo model
let Repo = mongoose.model('Repo', repoSchema);

// save takes in raw JSON response data, and transpiles it into the required schema structure before
// saving to the Mongo database
let save = (data, callback) => {
  let returnedUsers = []; // create empty array to store data returned by database

  data.forEach((repo) => {
    // map required data to schema object
    // let newUser = Repo({ // changed newUser to object, so we can insert using findOneAndUpdate()
    let newUser = {
      id: repo.id,
      name: repo.name,
      owner: {
        login: repo.owner.login,
        id: repo.owner.id,
        avatar_url: repo.owner.avatar_url,
        html_url: repo.owner.html_url
      },
      html_url: repo.html_url,
      description: repo.description,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      watchers_count: repo.watchers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      forks_count: repo.forks_count,
      open_issues: repo.open_issues,
      watchers: repo.watchers,
    };

    // originally used 'save' method.
    // it didn't work because it duplicates records

    // save schema object to the database
    // newUser.save((err, newUser) => {
    //   if (err) {
    //     console.log('Error attempting to save to database:', err);
    //     return callback(err);
    //   }
    //   console.log(`New repo record with id ${newUser.id} created in database!`);
    // });

    // create findOneAndUpdate options/queries
    const filter = { id: repo.id }; // query to search with
    const update = newUser; // object to insert if filter criteria isn't found
    const options = { // findOneAndUpdate function options
      new: true, // this forces Mongo to return the updated data, not the pre-update data
      upsert: true // Make this update into an upsert
    }
    // save/update database with schema object
    Repo.findOneAndUpdate(filter, update, options, (err, returnedUserData) => {
      if (err) {
        console.log('Error attempting to save to database:', err);
        return callback(err);
      }
      console.log(`New repo record with id ${returnedUserData.id} for user ${returnedUserData.owner.login} created in database!`);
      returnedUsers.push(returnedUserData);

      // check if all data from GitHub request has been successfully saved, and if so call callback with all data saved to database
      if (returnedUsers.length >= data.length) {
        console.log(`Finished database 'save' function, and triggering callback to server/index.js`);
        callback(); // if client requires new database entries, send in this callback (null, returnedUsers)
      }
    });
  });
}

let getFiltered = (filterCriteria, callback) => {
  // filter Criteria can be either a simple string representing a github username,
  // or else a JSON object representing a number of query filters/sort criteria.
  // See https://mongoosejs.com/docs/queries.html for more info on constructing queries.


  // If JSON object, expected structure (example):

  /*

  {
    "queryCriteria": {
      "owner.id": 25001461,
      "watchers_count": {
        "$gt": 0,
        "$lt": 5
      },
      "created_at": {
        "$gt": "2018-01-14T01:00:00+01:00"
      }
    },
    "sortCriteria": {
      "created_at": -1
    },
    "limitCriteria": 25
  }

  */

  // Set defaults for sort and limits (if none passed in with JSON object)
  const defaultSort = 'updated_at';
  const defaultLimit = 25;

  let queryCriteria = filterCriteria.queryCriteria; // set queryCriteria to passed in object (default)

  // Check and set the queryCriteria based on filterCriteria being a string or undefined
  if (!filterCriteria.queryCriteria) {
    if (typeof filterCriteria === 'string') {
      queryCriteria = { "owner.login": filterCriteria }; // set queryCriteria to passed in string
    }
    else if (!filterCriteria) {
      queryCriteria = { "owner.login": {} }; // set queryCriteria to empty object
    }
  }

  const sortCriteria = filterCriteria.sortCriteria || defaultSort;
  const limitCriteria = filterCriteria.limitCriteria || defaultLimit;

  Repo
    .find(queryCriteria)
    .sort(sortCriteria)
    .limit(limitCriteria)
    .exec(callback);
}

module.exports.save = save;
module.exports.getFiltered = getFiltered;