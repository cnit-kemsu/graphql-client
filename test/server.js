const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql_schema');
const sqlite = require('sqlite');

const app = express();

app.use('/graphql', graphqlHTTP( 
  async () => {
    const db = await sqlite.open('./test/localdb');
    return {
        schema,
        context: {
          db
        },
        extensions() {
          db.close();
        },
        graphiql: true
    };
  }
));

app.listen(8080);