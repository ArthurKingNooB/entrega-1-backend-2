import MongoDAO from './mongo.dao.js';
import CartModel from '../models/cart.model.js';

class CartDAO extends MongoDAO {
    constructor() {
        super(CartModel);
    }

    getPopulatedById(id) {
        return this.model.findById(id).populate('products.product');
    }
}

export default new CartDAO();
