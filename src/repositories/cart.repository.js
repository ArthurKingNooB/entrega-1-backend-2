import cartDAO from '../dao/cart.dao.js';
import productDAO from '../dao/product.dao.js';

class CartRepository {
    createCart() {
        return cartDAO.create({ products: [] });
    }

    getCartById(id) {
        return cartDAO.getPopulatedById(id);
    }

    async addProductToCart(cid, pid) {
        const cart = await cartDAO.model.findById(cid);
        if (!cart) return null;

        const product = await productDAO.model.findById(pid);
        if (!product) {
            const error = new Error('Producto no encontrado');
            error.statusCode = 404;
            throw error;
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();
        return cartDAO.getPopulatedById(cid);
    }

    async replaceProducts(cid, products) {
        return cartDAO.update(cid, { products });
    }
}

export default new CartRepository();
