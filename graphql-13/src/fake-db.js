const {
	RandomUser,
	RandomCategory,
	RandomProduct,
	RandomOrder,
	RandomOrderedProducts,
} = require('./mocker');

const { faker } = require('@faker-js/faker');

class CommonModel {
	constructor(items) {
		this.items = items ?? [];
	}

	getAll() {
		return this.items;
	}

	getOne(id) {
		return this.items.find(item => item.id === id);
	}

	addOne(item) {
		const fullItem = this._fillItem(item);
		this.items = [...this.items, fullItem];
		return fullItem;
	}

	addMany(items) {
		const fullItems = items.map(item => this._fillItem(item));
		this.items = [...this.items, ...fullItems];
		return fullItems;
	}

	deleteOne(id) {
		this.items = this.items.filter(item => item.id !== id);
		return { id };
	}

	updateOne(id, data) {
		const newItem = { id, ...data };
		this.items = this.items.map(item => item.id !== newItem.id ? item : { ...item, ...newItem });
		return newItem;
	}

	_fillItem(newItem) {
		const id = faker.datatype.uuid();
		return { ...newItem, id };
	}
}

class User extends CommonModel {
	constructor() {
		const randomUser = new RandomUser();
		const users = randomUser.createMany(3);
		super(users);
	}

	_fillItem(newUser) {
		const id = faker.datatype.uuid();
		const registeredAt = new Date();
		return { ...newUser, id, registeredAt };
	}
}

class Order extends CommonModel {
	constructor() {
		const randomOrder = new RandomOrder();
		const orders = randomOrder.createManyToOne(5, { relationItems: user.getAll(), key: 'userId' });
		super(orders);
	}
}

class Category extends CommonModel {
	constructor() {
		const randomCategories = new RandomCategory();
		const categories = randomCategories.createMany(3);
		super(categories);
	}
}

class Product extends CommonModel {
	constructor() {
		const randomProduct = new RandomProduct();
		const products = randomProduct.createManyToOne(12, { relationItems: category.getAll(), key: 'categoryId' });
		super(products);
	}
}

class OrderedProduct extends CommonModel {
	constructor() {
		const randomOrderedProducts = new RandomOrderedProducts(product.getAll(), 4);
		const orderedProducts = randomOrderedProducts.createManyToMany(
			10,
			{ relationItems: order.getAll(), key: 'orderId' },
			{ relationItems: product.getAll(), key: 'productId' },
		);
		super(orderedProducts);
	}
}

const user = new User();
const order = new Order();
const category = new Category();
const product = new Product();
const orderedProduct = new OrderedProduct();


module.exports = {
	user,
	order,
	category,
	product,
	orderedProduct
}
