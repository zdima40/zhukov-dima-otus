const { faker } = require('@faker-js/faker');

class CommonRandom {
	created = {};

	createMany(
		count,
		{ relationItems: relationItemsOne, key: keyOne } = {},
		{ relationItems: relationItemsTwo, key: keyTwo } = {}
	) {
		if (relationItemsOne && keyOne && relationItemsTwo && keyTwo) {
			return this.#manyToMany(
				count,
				{ relationItems: relationItemsOne, key: keyOne },
				{ relationItems: relationItemsTwo, key: keyTwo }
			);
		} else if (relationItemsOne && keyOne) {
			return this.#oneToMany(
				count,
				{ relationItems: relationItemsOne, key: keyOne },
			);
		} else {
			return this.#noRelationship(count);
		}
	}

	#noRelationship(count) {
		return Array.from({ length: count }).map(() => this._createOne());
	}

	#oneToMany(
		count,
		{ relationItems: relationItemsOne, key: keyOne } = {},
	) {
		return Array.from({ length: count }).map(() => {
			const itemOne = this._getRandomItem(relationItemsOne);
			const item =  this._createOne();
			item[keyOne] = itemOne.id;
			return item;
		});
	}

	#manyToMany(
		count,
		{ relationItems: relationItemsOne, key: keyOne } = {},
		{ relationItems: relationItemsTwo, key: keyTwo } = {}
	) {
		let items = [];

		const allComplexKeys = this._createAllComplexKeys(
			{ relationItems: relationItemsOne, key: keyOne },
			{ relationItems: relationItemsTwo, key: keyTwo }
		)

		const getUniqComplexKey = () => {
			const complexKey = faker.helpers.arrayElement(allComplexKeys);
			return complexKey.key;
		};

		const maxCount = relationItemsOne.length * relationItemsTwo.length;
		const newCount = count > maxCount ? maxCount : count;

		Array.from({ length: newCount }).forEach(() => {
			const item =  this._createOne();

			let complexKey;
			if (item[keyTwo]) {
				const exclude = allComplexKeys.filter(complexKey => complexKey.keyTwo !== item[keyTwo]);
				complexKey = faker.unique(getUniqComplexKey, null, { exclude });
			} else {
				complexKey = faker.unique(getUniqComplexKey, null);
			}

			const [pkeyOne, pkeyTwo] = complexKey.split(':');
			item[keyOne] = pkeyOne;
			item[keyTwo] = pkeyTwo;

			items.push(item);
		});

		return items;
	}

	_createAllComplexKeys(
		{ relationItems: relationItemsOne } = {},
		{ relationItems: relationItemsTwo } = {}
	) {
		const result = [];
		for (let i = 0; i < relationItemsOne.length; i++) {
			for (let j = 0; j < relationItemsTwo.length; j++) {
				const keyOne = relationItemsOne[i].id;
				const keyTwo = relationItemsTwo[j].id;
				result.push({ key: `${keyOne}:${keyTwo}`, keyOne, keyTwo });
			}
		}
		return result;
	}

	_getRandomItem(items) {
		const itemIndex = faker.datatype.number(items.length - 1);
		return items[itemIndex];
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
			categoryId: null,
		};
	}
}

class RandomOrder extends CommonRandom {
  _createOne() {
		return {
			id: faker.datatype.uuid(),
			date: faker.date.past(),
			status: faker.helpers.arrayElement(['registered', 'sent', 'delivered']),
			userId: null,
		};
	}
}

class RandomOrderedProducts extends CommonRandom {
	constructor(products, orderedProductsMaxCount) {
		super();
		this.products = products;
		this.orderedProductsMaxCount = orderedProductsMaxCount;
	}

  _createOne() {
		const product = this._getRandomItem(this.products);

		return {
			orderId: null,
			productId: product.id,
			name: product.name,
			price: product.price,
			quantity: faker.datatype.number({ min: 1, max: this.orderedProductsMaxCount }),
		};
	}
}

const randomUser = new RandomUser();
const users = randomUser.createMany(10);

const randomCategories = new RandomCategory();
const categories = randomCategories.createMany(3);

const randomProduct = new RandomProduct();
const products = randomProduct.createMany(12, { relationItems: categories, key: 'categoryId' });

const randomOrder = new RandomOrder();
const orders = randomOrder.createMany(5, { relationItems: users, key: 'userId' });

const randomOrderedProducts = new RandomOrderedProducts(products, 4);
const orderedProducts = randomOrderedProducts.createMany(
	10,
	{ relationItems: orders, key: 'orderId' },
	{ relationItems: products, key: 'productId' },
);


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

	getOrderedProducts() {
		return orderedProducts;
	},
}
