import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { GraphqlClient } from '../src/classes/GraphqlClient';
import { GraphqlProvider } from '../src/comps/GraphqlProvider';
import { useQuery } from '../src/hooks/useQuery';

const client = new GraphqlClient('/api');

const usersQuery = `
  query users($limit: Int!) {
    users(limit: $limit) {
      id
      username
      email
    }
  }
`;

function Users() {

  console.log('render Users');
  const [limit, setLimit] = useState(5);
  const [data, refetch, loading, error] = useQuery(usersQuery, { limit });

  return (<>
    <div>
      <button onClick={() => refetch()}>refetch</button>
    </div>
    {loading ? 'loading...' : (
      error ? JSON.stringify(error) :
      data.users?.map(
        ({ id, username, email }) => <div key={id}>
          <div>id: {id}</div>
          <div>username: {username}</div>
          <div>email: {email}</div>
        </div>
      )
    )}
    <div>
      <button onClick={() => setLimit(5)}>set limit 5</button>
      <button onClick={() => setLimit(10)}>set limit 10</button>
      <button onClick={() => setLimit('str')}>set limit 'str'</button>
    </div>
  </>);
}

function App() {

  return (
    <GraphqlProvider client={client}>
      {/* <Users /> */}
      <div>123</div>
    </GraphqlProvider>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
