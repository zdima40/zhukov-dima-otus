const { faker } = require('@faker-js/faker');

class CommonRandom {
	createMany(count, relationItems, key) {
		return Array.from({ length: count }).map(() => this.createOne(relationItems, key));
	}

	createOne(relationItems, key) {
		let randomProduct = this._createOne();

		if (relationItems && key) {
			const categoryIndex = faker.datatype.number(relationItems.length - 1);
			randomProduct[key] = relationItems[categoryIndex].id;
		}

		return randomProduct;
	}

	_createOne() {
		throw new Error('Not implemented!');
	}
}

class RandomUser extends CommonRandom {
	_createOne() {
		return {
			id: faker.datatype.uuid(),
			name: faker.internet.userName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			registeredAt: faker.date.past(),
		};
	}
}

class RandomCategory extends CommonRandom {
	_createOne() {
		return {
			id: faker.datatype.uuid(),
			name: faker.commerce.department(),
		};
	}
}

class RandomProduct extends CommonRandom {
	_createOne() {
		return {
			id: faker.datatype.uuid(),
			name: faker.commerce.product(),
			price: faker.commerce.price(),
		};
	}
}

class RandomOrder extends CommonRandom {
	orderedCount = {};

	constructor(products, orderedProductsMaxCount) {
		super();
		this.products = products;
		this.orderedProductsMaxCount = orderedProductsMaxCount;
	}

	_createOne() {
		this.orderedCount = {};

		const ordersCount = faker.datatype.number({ min: 1, max: this.orderedProductsMaxCount });

		const orderProducts = [];

		Array.from({ length: ordersCount }).forEach(() => {
			const productIndex = faker.datatype.number(products.length - 1);
			const product = this.products[productIndex];

			if (this.orderedCount[product.id]) {
				this.orderedCount[product.id] += 1;
			} else {
				this.orderedCount[product.id] = 1;
				orderProducts.push({ ...product });
			}
		});

		const countedOrderProducts = orderProducts.map(product => {
			product.count = this.orderedCount[product.id];
			return product;
		});

		return {
			id: faker.datatype.uuid(),
			date: faker.date.past(),
			products: countedOrderProducts,
		};
	}
}

const randomUser = new RandomUser();
const users = randomUser.createMany(10);

const randomCategories = new RandomCategory();
const categories = randomCategories.createMany(6);

const randomProduct = new RandomProduct();
const products = randomProduct.createMany(10, categories, 'categoryId');

const randomOrder = new RandomOrder(products, 3);
const orders = randomOrder.createMany(20, users, 'userId');

module.exports = {
	getUsers() {
		return users;
	},

	getProducts() {
		return products;
	},

	getCategories() {
		return categories;
	},

	getOrders() {
		return orders;
	},
}
