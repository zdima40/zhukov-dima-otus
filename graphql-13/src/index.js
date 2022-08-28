const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const { getUsers, getProducts, getCategories, getOrders, getOrderedProducts } = require('./mocker');

const app = express();
const PORT = 3000;

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

