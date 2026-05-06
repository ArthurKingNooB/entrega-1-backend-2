import { Router } from 'express';
import CartModel from '../models/cart.model.js';
import ProductModel from '../models/product.model.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = await CartModel.create({ products: [] });
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await CartModel.findById(req.params.cid).populate('products.product').lean();
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Id de carrito invalido' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await CartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const product = await ProductModel.findById(pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);

        if (productIndex === -1) {
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        await cart.save();

        const updatedCart = await CartModel.findById(cid).populate('products.product').lean();
        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;
