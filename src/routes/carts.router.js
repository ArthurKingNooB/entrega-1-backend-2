import { Router } from 'express';
import cartRepository from '../repositories/cart.repository.js';
import purchaseService from '../services/purchase.service.js';
import { passportCall } from '../middlewares/passportCall.js';
import { authorization } from '../middlewares/authorization.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = await cartRepository.createCart();
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartRepository.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Id de carrito invalido' });
    }
});

router.post('/:cid/product/:pid', passportCall('current'), authorization('user'), async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const userCartId = req.user.cart?._id?.toString() || req.user.cart?.toString();

        if (userCartId !== cid) {
            return res.status(403).json({ status: 'error', message: 'Solo puede modificar su propio carrito' });
        }

        const updatedCart = await cartRepository.addProductToCart(cid, pid);
        if (!updatedCart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(error.statusCode || 400).json({ status: 'error', message: error.message });
    }
});

router.post('/:cid/purchase', passportCall('current'), authorization('user'), async (req, res) => {
    try {
        const { cid } = req.params;
        const userCartId = req.user.cart?._id?.toString() || req.user.cart?.toString();

        if (userCartId !== cid) {
            return res.status(403).json({ status: 'error', message: 'Solo puede comprar su propio carrito' });
        }

        const result = await purchaseService.purchaseCart(cid, req.user.email);
        res.json({ status: 'success', payload: result });
    } catch (error) {
        res.status(error.statusCode || 400).json({ status: 'error', message: error.message });
    }
});

export default router;
