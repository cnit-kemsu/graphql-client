import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { GraphqlClient } from '@lib/GraphqlClient';
import { Mutation } from '@lib/Mutation';
import { refetch } from '@lib/refetch';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';

GraphqlClient.url = '/api';

const USERS_QUERY = ({ limit = 'Int' }) => `
  users(limit: ${limit}) {
    id
    username
    email
  }
`;

const USERS_COUNT_QUERY = () => `usersCount`;

const CREATE_USER_MUTATION = ({ username = 'String!', email = 'String!' }) => `
  createUser(username: ${username}, email: ${email}) {
    id
    username
    email
  }
`;

const DELETE_USER_MUTATION = ({ id = 'Int!' }) => `
  deleteUser(id: ${id}) {
    id
    username
    email
  }
`;

const deleteUser = new Mutation(DELETE_USER_MUTATION, {
  onComplete: () => { console.log('delete user success'); refetch(USERS_QUERY, USERS_COUNT_QUERY); },
  onError: console.error
}).commit;

function Users() {

  console.log('render Users');
  const [limit, setLimit] = useState(5);
  const [{ users }, loading1, errors1] = useQuery(USERS_QUERY, { limit }, {
    onComplete: () => console.log('fetch users success'),
    onError: console.error
  });
  const [{ usersCount }, loading2, errors2] = useQuery(USERS_COUNT_QUERY, {}, {
    onComplete: () => console.log('fetch users count success'),
    onError: console.error
  });

  const createUser = useMutation(CREATE_USER_MUTATION, {
    onComplete: () => { console.log('mutate success'); refetch(USERS_QUERY, USERS_COUNT_QUERY); },
    onError: console.error
  }, { email: 'standard@email.com' });

  return <>
    <div>
      <button onClick={() => refetch(USERS_QUERY)}>refetch users</button>
      <button onClick={() => refetch(USERS_COUNT_QUERY)}>refetch users count</button>
      <button onClick={() => refetch([USERS_QUERY, { limit: 1 }], USERS_COUNT_QUERY)}>refetch users and users count</button>
    </div>
    Users count: {loading2 ? 'loading...' : (
      errors2 && !usersCount ? JSON.stringify(errors2) :
      usersCount
    )}
    {loading1 ? 'loading...' : (
      errors1 && !users ? JSON.stringify(errors1) :
      users?.map(
        ({ id, username, email }) => <div key={id}>
          <div>id: {id}</div>
          <div>username: {username}</div>
          <div>email: {email}</div>
          <div><button onClick={() => deleteUser({ id })}>Delete user</button></div>
        </div>
      )
    )}
    <div>
      <button onClick={() => setLimit(5)}>set limit to 5</button>
      <button onClick={() => setLimit(10)}>set limit to 10</button>
      <button onClick={() => setLimit('str')}>set limit to 'str'</button>
    </div>
    <div>
      <div>Add user</div>
      <form name="form1" onSubmit={event => {
        event.preventDefault();
        const values = {};
        for (const input of document.forms.form1.elements) {
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
  </>;
}

function App() {

  console.log('render app');
  return (
    <Users />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
