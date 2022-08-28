const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLFloat, GraphQLInt } = graphql;
const { user, order, product, category, orderedProduct } = require('../fake-db');

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    registeredAt: { type: GraphQLString },
  })
});

const Order = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: { type: GraphQLID },
    date: { type: GraphQLString },
    status: { type: GraphQLString },
    user: {
      type: User,
      resolve(source, args) {
        const users = user.getAll();
        return users.find(user => user.id === source.userId);
      }
    },
  })
});

const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  })
});

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat }
  })
});

const OrderedProduct = new GraphQLObjectType({
  name: 'OrderedProduct',
  fields: () => ({
    order: {
      type: Order,
      resolve(source, args) {
        console.log(source);
        const orders = order.getAll();
        return orders.find(order => order.id === source.orderId);
      }
    },
    product: {
      type: Product,
      resolve(source, args) {
        const products = product.getAll();
        return products.find(product => product.id === source.productId);
      }
    },
    name: { type: GraphQLString },
    price: { type: GraphQLFloat },
    quantity: { type: GraphQLInt },
  })
});


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: {
      type: new GraphQLList(User),
      resolve(source, args) {
        return user.getAll();
      }
    },
    user: {
      type: User,
      args: { id: { type: GraphQLID } },
      resolve(source, { id }) {
        return user.getOne(id);
      }
    },
    orders: {
      type: new GraphQLList(Order),
      resolve(source, args) {
        return order.getAll();
      }
    },
    order: {
      type: Order,
      args: { id: { type: GraphQLID } },
      resolve(source, { id }) {
        return order.getOne(id);
      }
    },
    products: {
      type: new GraphQLList(Product),
      resolve(source, args) {
        return product.getAll();
      }
    },
    product: {
      type: Product,
      args: { id: { type: GraphQLID } },
      resolve(source, { id }) {
        return product.getOne(id);
      }
    },
    categories: {
      type: new GraphQLList(Category),
      resolve(source, args) {
        return category.getAll();
      }
    },
    category: {
      type: Category,
      args: { id: { type: GraphQLID } },
      resolve(source, { id }) {
        return category.getOne(id);
      }
    },
    orderedProducts: {
      type: new GraphQLList(OrderedProduct),
      resolve(source, args) {
        return orderedProduct.getAll();
      }
    },
    orderedProduct: {
      type: OrderedProduct,
      args: { id: { type: GraphQLID } },
      resolve(source, { id }) {
        return orderedProduct.getOne(id);
      }
    },
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: User,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, { name, email, password }) {
        return user.addOne({ name, email, password });
      }
    },
    updateUser: {
      type: User,
      args: {
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve(parent, { id, name, email, password }) {
        return user.updateOne(id, { name, email, password });
      }
    },
    deleteUser: {
      type: User,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return user.deleteOne(id);
      }
    },
    addOrder: {
      type: Order,
      args: {
        date: { type: GraphQLString },
        status: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, { date, status, userId }) {
        return order.addOne({ date, status, userId });
      }
    },
    updateOrder: {
      type: Order,
      args: {
        id: { type: GraphQLID },
        date: { type: GraphQLString },
        status: { type: GraphQLString },
        userId: { type: GraphQLID },
      },
      resolve(parent, { id, date, status, userId }) {
        return order.updateOne(id, { date, status, userId });
      }
    },
    deleteOrder: {
      type: Order,
      args: { id: { type: GraphQLID } },
      resolve(parent, { id }) {
        return order.deleteOne(id);
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});
