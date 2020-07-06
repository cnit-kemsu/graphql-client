import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { GraphqlClient } from '@classes/GraphqlClient';
import { Mutation } from '@classes/Mutation';
import { refetch } from '@classes/refetch';
import { useQuery } from '@hooks/useQuery';
import { useMutation } from '@hooks/useMutation';

GraphqlClient.url = '/graphql';

const ALL_USERS_QUERY = ({ limit = 'Int' }) => `
  users(limit: ${limit}) {
    id
    username
    email
  }
`;

const USER_COUNT_QUERY = () => `usersCount`;

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
  onComplete: () => {
    console.log('delete user success');
    refetch(ALL_USERS_QUERY, USER_COUNT_QUERY);
  },
  onError: console.error
}).commit;

const boxStyle = {
  padding: '4px',
  margin: '4px',
  maxWidth: '400px'
};

function Users() {
  console.log('render Users');

  const [limit, setLimit] = useState(5);

  const [{ users }, loading1, errors1] = useQuery(ALL_USERS_QUERY, { limit }, {
    onComplete: () => console.log('fetch user list: success'),
    onError: console.error
  });

  const [{ usersCount }, loading2, errors2] = useQuery(USER_COUNT_QUERY, {}, {
    onComplete: () => console.log('fetch user count: success'),
    onError: console.error
  });

  const createUser = useMutation(CREATE_USER_MUTATION, {
    onComplete: () => {
      console.log('mutate success');
      refetch(ALL_USERS_QUERY, USER_COUNT_QUERY);
    },
    onError: console.error
  }, { email: 'standard@email.com' });

  const handleFormSubmit = useCallback(event => {
    event.preventDefault();
  
    const values = {};
    for (const input of document.forms.form1.elements) {
      if (input.type !== 'submit' && input.value) values[input.name] = input.value;
    }
    
    createUser(values);
  }, []);

  return (
    <>

      <div>
        <button onClick={() => refetch(ALL_USERS_QUERY)}>refetch user list</button><br/>
        <button onClick={() => refetch(USER_COUNT_QUERY)}>refetch user count</button><br/>
        <button onClick={() => refetch([ALL_USERS_QUERY, { limit: 1 }], USER_COUNT_QUERY)}>refetch user list and user count</button><br/>
      </div>

      <div style={{ border: '1px solid green', ...boxStyle }}>
        User count: {loading2 ? 'loading...' : (
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
      </div>

      <div>
        <button onClick={() => setLimit(5)}>set user limit to 5</button><br/>
        <button onClick={() => setLimit(10)}>set user limit to 10</button><br/>
        <button onClick={() => setLimit('str')}>set user limit to 'str'</button><br/>
      </div>

      <div style={{ border: '1px solid blue', ...boxStyle }}>
        <div>Add user</div>
        <form name="form1" onSubmit={handleFormSubmit}>
          <div>
            <span>name</span>
            <input name="username" type="text"/>
          </div>
          <div>
          <span>email</span>
            <input name="email" type="text"/>
          </div>
          <div>
            <input type="submit"/>
          </div>
        </form>
      </div>

    </>
  );
}

function App() {
  console.log('render App');

  return (
    <Users />
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
