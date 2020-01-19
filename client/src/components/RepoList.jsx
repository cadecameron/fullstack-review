import React from 'react';

const RepoList = ({ repos }) => (
  <div>
    <h4> Repo List Component </h4>
    There are {repos.length} repos.
    <table>
      <tbody>
        {repos.map((repo) => <tr>{repo.owner.login}</tr>)}
      </tbody>
    </table>
  </div>
)

export default RepoList;