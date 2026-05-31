import MongoDAO from './mongo.dao.js';
import ProductModel from '../models/product.model.js';

class ProductDAO extends MongoDAO {
    constructor() {
        super(ProductModel);
    }
}

export default new ProductDAO();
