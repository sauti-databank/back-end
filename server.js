const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const server = express();


server.use('/graphql', expressGraphQL({
    graphiql: true,
    schema
}));

const GRAPHQL_PORT = process.env.PORT || 5000;

server.listen(GRAPHQL_PORT, () => {
    console.log('Server is Listening')
});