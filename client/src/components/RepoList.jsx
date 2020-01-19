import React from 'react';

// TODO: update component to properly render a table with information.
// Perhaps further breaking down this table into rows might be useful?


const RepoList = ({ repos }) => (
  <div>
    <h4> Repo List Component </h4>
    There are {repos.length} repos.
    <table className="repo-table">
      <thead>
        <tr>
          <th></th>
          <th>Repo Owner</th>
          <th>Repo Name</th>
        </tr>
      </thead>
      <tbody>
        {repos.map((repo, index) => <tr key={repo.id}>
          <td><img className="avatar" src={repo.owner.avatar_url}></img></td>
          <td>{repo.owner.login}</td>
          <td><a href={repo.html_url}>{repo.name}</a></td>
          <td></td>
        </tr>)}
      </tbody>
    </table>
  </div>
)

export default RepoList;