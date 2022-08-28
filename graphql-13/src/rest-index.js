const express = require('express');
const { getUsers, getProducts, getCategories, getOrders, getOrderedProducts } = require('./mocker');

const app = express();
const PORT = 3000;

app.get('/users', (req, res) => {
  const users = getUsers();
	res.json(users);
});

app.get('/products', (req, res) => {
  const products = getProducts();
	res.json(products);
});

app.get('/categories', (req, res) => {
  const categories = getCategories();
	res.json(categories);
});

app.get('/orders', (req, res) => {
  const orders = getOrders();
	res.json(orders);
});

app.get('/ordered', (req, res) => {
  const orderedProducts = getOrderedProducts();
	res.json(orderedProducts);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

