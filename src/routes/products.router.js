import { Router } from 'express';
import ProductModel from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await ProductModel.find().lean();
        res.json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.pid).lean();
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Id de producto invalido' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await ProductModel.create(req.body);
        res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const updated = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, {
            new: true,
            runValidators: true
        });

        if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        res.json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await ProductModel.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

        res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Id de producto invalido' });
    }
});

export default router;
