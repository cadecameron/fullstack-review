import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Search from './components/Search.jsx';
import RepoList from './components/RepoList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repos: []
    }

    this.search = this.search.bind(this);
    this.get = this.get.bind(this);
  }

  componentDidMount() {
    this.get();
  }

  search(term) {
    console.log(`Search function was triggered!`);
    // validate input
    if(!term) {
      console.log(`No input provided. Perhaps this was the page loading?`);
      return;
    }

    console.log(`${term} was searched`);

    // send post request to server endpoint '/repos'
    fetch('/repos', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain' //'application/json'
      },
      body: term //JSON.stringify(term)
    })
      .then((res) => {
        console.log(`Received response for POST request to server with status ${res.status}.`);
        // call get method with .then() to re-populate table?
      })
      .catch((err) => {
        console.log('Caught error attempting to post username to server:', err);
      })
  }

  get(criteria) {
    // TODO: create function to get results (either with defaults on page reload, or with filter criteria if supplied by the client)
    const filterCriteria = criteria || {};
    console.log(`Passing filterCritera to server: ${JSON.stringify(filterCriteria)}`);

    // send a get request to server endpoint '/repos'
    fetch('/repos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      //body: JSON.stringify(filterCriteria) /* insert either plain username text or JSON object */
    })
    .then((res) => {
      console.log(`Received response for GET request to server with status ${res.status}.`);
      return res.json();
    })
    .then((newRepoData) => {
      // refer to ./database/index.js for schema structure of JSON response
      this.setState({
        repos: newRepoData
      });
    })
    .catch((err) => {
      console.log('Caught error attempting to get repos from server:', err);
    })

  }

  render() {
    return (<div>
      <h1>Github Fetcher</h1>
      <RepoList repos={this.state.repos} />
      <Search onSearch={this.search} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));