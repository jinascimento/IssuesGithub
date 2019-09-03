import React from 'react';

const Repository = ({ match }) => {
  return <div>Repository : {decodeURIComponent(match.params.repository)}</div>;
};

export default Repository;
