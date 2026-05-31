import productDAO from '../dao/product.dao.js';

class ProductRepository {
    getProducts() {
        return productDAO.getAll();
    }

    getProductById(id) {
        return productDAO.getById(id);
    }

    createProduct(productData) {
        return productDAO.create(productData);
    }

    updateProduct(id, productData) {
        return productDAO.update(id, productData);
    }

    deleteProduct(id) {
        return productDAO.delete(id);
    }
}

export default new ProductRepository();
