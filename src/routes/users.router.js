import { Router } from 'express';
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import { createHash } from '../utils/bcrypt.js';
import { passportCall } from '../middlewares/passportCall.js';
import { authorization } from '../middlewares/authorization.js';

const router = Router();

const sanitizeUser = user => {
    const plainUser = user.toObject ? user.toObject() : user;
    delete plainUser.password;
    return plainUser;
};

router.get('/', passportCall('jwt'), authorization('admin'), async (req, res) => {
    const users = await UserModel.find().populate('cart').lean();
    const sanitizedUsers = users.map(user => {
        delete user.password;
        return user;
    });

    res.json({ status: 'success', payload: sanitizedUsers });
});

router.get('/:uid', passportCall('jwt'), async (req, res) => {
    const user = await UserModel.findById(req.params.uid).populate('cart');
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    res.json({ status: 'success', payload: sanitizeUser(user) });
});

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' });
        }

        const exists = await UserModel.findOne({ email });
        if (exists) {
            return res.status(409).json({ status: 'error', message: 'El email ya esta registrado' });
        }

        const cart = await CartModel.create({ products: [] });
        const user = await UserModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: cart._id,
            role
        });

        res.status(201).json({ status: 'success', payload: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.put('/:uid', passportCall('jwt'), async (req, res) => {
    try {
        const updateData = { ...req.body };
        delete updateData._id;
        delete updateData.email;

        if (updateData.password) {
            updateData.password = createHash(updateData.password);
        }

        const user = await UserModel.findByIdAndUpdate(req.params.uid, updateData, {
            new: true,
            runValidators: true
        });

        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

        res.json({ status: 'success', payload: sanitizeUser(user) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.delete('/:uid', passportCall('jwt'), authorization('admin'), async (req, res) => {
    const user = await UserModel.findByIdAndDelete(req.params.uid);
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    res.json({ status: 'success', message: 'Usuario eliminado' });
});

export default router;
