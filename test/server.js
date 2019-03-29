const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./graphql_schema');

const app = express();

app.use('/graphql', graphqlHTTP( 
  () => {
    return {
        schema,
        graphiql: true
    };
  }
));

app.listen(8080);