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
  }

  search(term) {
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
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) =>{
        console.log('Caught err:', err);
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