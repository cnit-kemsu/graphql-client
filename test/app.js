import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { GraphqlClient } from '../src/classes/GraphqlClient';
import { GraphqlProvider } from '../src/comps/GraphqlProvider';
import { useQuery } from '../src/hooks/useQuery';
import { useMutation } from '../src/hooks/useMutation';

const client = new GraphqlClient('/graphql');

const USERS_QUERY = ({ limit = 'Int!' }) => `
  users(limit: ${limit}) {
    id
    username
    email
  }
`;

const USERS_COUNT_QUERY = () => `
  usersCount
`;

const createUserMutation = `
  mutation createUser($username: String!, $email: String) {
    createUser(username: $username, email: $email) {
      id
      username
      email
    }
  }
`;

const deleteUserMutation = `
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
      username
      email
    }
  }
`;

function Users() {

  console.log('render Users');
  const [limit, setLimit] = useState(5);
  const [data, loading, refetch, error] = useQuery(USERS_QUERY, { limit }, {
    onComplete: () => console.log('fetch success'),
    onError: console.error
  });
  const [data1, loading1, refetch1, error1] = useQuery(USERS_COUNT_QUERY, {}, {
    onComplete: () => console.log('fetch success'),
    onError: console.error
  });

  const createUser = useMutation(createUserMutation, { email: 'standard@email.com' }, {
    onComplete: () => { console.log('mutate success'); refetch(); },
    onError: console.error
  });
  const deleteUser = useMutation(deleteUserMutation, {}, {
    onComplete: () => { console.log('mutate success'); refetch(); },
    onError: console.error
  });

  return (<>
    <div>
      <button onClick={() => refetch()}>refetch</button>
    </div>
    Users count: {loading1 ? 'loading...' : (
      error1 ? JSON.stringify(error1) :
      data1.usersCount
    )}
    {loading ? 'loading...' : (
      error ? JSON.stringify(error) :
      data.users?.map(
        ({ id, username, email }) => <div key={id}>
          <div>id: {id}</div>
          <div>username: {username}</div>
          <div>email: {email}</div>
          <div><button onClick={() => deleteUser({ id })}>Delete user</button></div>
        </div>
      )
    )}
    <div>
      <button onClick={() => setLimit(5)}>set limit 5</button>
      <button onClick={() => setLimit(10)}>set limit 10</button>
      <button onClick={() => setLimit('str')}>set limit 'str'</button>
    </div>
    <div>
      <div>Add user</div>
      <form name="form1" onSubmit={event => {
        event.preventDefault();
        const values = {};
        for(const input of document.forms.form1.elements) {
          if (input.type !== 'submit' && input.value) values[input.name] = input.value;
        }
        createUser(values);
      }}>
        <div>
          <input name="username" type="text"/>
        </div>
        <div>
          <input name="email" type="text"/>
        </div>
        <div>
          <input type="submit"/>
        </div>
      </form>
    </div>
  </>);
}

function App() {

  console.log('render app');
  return (
    <GraphqlProvider client={client}>
      <Users />
    </GraphqlProvider>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
