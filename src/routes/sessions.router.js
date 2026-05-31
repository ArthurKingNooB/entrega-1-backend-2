import { Router } from 'express';
import { generateToken } from '../utils/jwt.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

const buildUserResponse = user => ({
    id: user._id?.toString() || user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    age: user.age,
    cart: user.cart,
    role: user.role
});

router.post('/register', passportCall('register'), (req, res) => {
    res.status(201).json({ status: 'success', payload: buildUserResponse(req.user) });
});

router.post('/login', passportCall('login'), (req, res) => {
    const user = buildUserResponse(req.user);
    const token = generateToken(user);

    res.json({ status: 'success', token });
});

router.get('/current', passportCall('current'), (req, res) => {
    res.json({ status: 'success', payload: req.user });
});

export default router;
