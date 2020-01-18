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

    // old 'save' method didn't work, because it duplicates records

    // save schema object to the database
    // newUser.save((err, newUser) => {
    //   if (err) {
    //     console.log('Error attempting to save to database:', err);
    //     return callback(err);
    //   }
    //   console.log(`New repo record with id ${newUser.id} created in database!`);
    // });

    // create findOneAndUpdate options/queries
    const filter = { id: repo.id };
    const update = newUser;
    const options = {
      new: true, // this forces Mongo to return the updated data, not the pre-update data
      upsert: true // Make this update into an upsert
    }
    // save/update database with schema object
    Repo.findOneAndUpdate(filter, update, options, (err, userData) => {
      if (err) {
        console.log('Error attempting to save to database:', err);
        return callback(err);
      }
      console.log(`New repo record with id ${userData.id} created in database!`);
    });

  });

  // call callback function
  callback(null, data);
}

let findAll = () => {
  // TODO: write query to get all records from the database
}

let getFiltered = (filterCriteria) => {
  // TODO: write query to get filtered records from the database
}

module.exports.save = save;
module.exports.findAll = findAll;
module.exports.getFiltered = getFiltered;