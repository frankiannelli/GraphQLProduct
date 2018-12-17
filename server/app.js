const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGOOSE_DATABASE, ()=> {
  console.log('error connecting to database is mongo running?');
});

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(4000, () => console.log('Server started on port 4000'));