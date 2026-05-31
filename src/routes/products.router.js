import { Router } from 'express';
import productRepository from '../repositories/product.repository.js';
import { passportCall } from '../middlewares/passportCall.js';
import { authorization } from '../middlewares/authorization.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productRepository.getProducts();
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productRepository.getProductById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Id de producto invalido' });
    }
});

router.post('/', passportCall('current'), authorization('admin'), async (req, res) => {
    try {
        const newProduct = await productRepository.createProduct(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', passportCall('current'), authorization('admin'), async (req, res) => {
    try {
        const updated = await productRepository.updateProduct(req.params.pid, req.body);

        if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        res.json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', passportCall('current'), authorization('admin'), async (req, res) => {
    try {
        const deleted = await productRepository.deleteProduct(req.params.pid);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Id de producto invalido' });
    }
});

export default router;
