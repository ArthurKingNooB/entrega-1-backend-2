import crypto from 'crypto';
import cartRepository from '../repositories/cart.repository.js';
import ticketRepository from '../repositories/ticket.repository.js';

class PurchaseService {
    async purchaseCart(cid, purchaserEmail) {
        const cart = await cartRepository.getCartById(cid);
        if (!cart) {
            const error = new Error('Carrito no encontrado');
            error.statusCode = 404;
            throw error;
        }

        const purchasedProducts = [];
        const rejectedProducts = [];
        let amount = 0;

        for (const item of cart.products) {
            const product = item.product;

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                purchasedProducts.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price
                });

                amount += product.price * item.quantity;
            } else {
                rejectedProducts.push({
                    product: product._id,
                    quantity: item.quantity
                });
            }
        }

        let ticket = null;

        if (purchasedProducts.length > 0) {
            ticket = await ticketRepository.createTicket({
                code: crypto.randomUUID(),
                amount,
                purchaser: purchaserEmail,
                products: purchasedProducts
            });
        }

        await cartRepository.replaceProducts(cid, rejectedProducts);

        return {
            ticket,
            purchasedProducts,
            rejectedProducts
        };
    }
}

export default new PurchaseService();
