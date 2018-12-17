const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGOOSE_DATABASE);

mongoose.connection.once('open', () => {
  console.log('Connected to database');
});

mongoose.connection.once('error', () => {
  console.log('Error connecting to database. Is mongo running...?');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000, () => console.log('Server started on port 4000'));
