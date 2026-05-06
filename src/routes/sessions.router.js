import { Router } from 'express';
import UserModel from '../models/user.model.js';
import CartModel from '../models/cart.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

const buildUserResponse = user => ({
    id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    cart: user.cart,
    role: user.role
});

router.post('/register', async (req, res) => {
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

        res.status(201).json({ status: 'success', payload: buildUserResponse(user) });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email y password son obligatorios' });
        }

        const user = await UserModel.findOne({ email }).lean();
        if (!user || !isValidPassword(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Credenciales invalidas' });
        }

        const token = generateToken(buildUserResponse(user));
        res.json({ status: 'success', token });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/current', passportCall('current'), (req, res) => {
    res.json({ status: 'success', payload: req.user });
});

export default router;
