import { Router } from 'express';
import { generateToken } from '../utils/jwt.js';
import { passportCall } from '../middlewares/passportCall.js';
import userRepository from '../repositories/user.repository.js';
import mailService from '../services/mail.service.js';

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
    res.json({ status: 'success', payload: userRepository.toCurrentDTO(req.user) });
});

router.post('/password-recovery', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: 'error', message: 'El email es obligatorio' });

        const recovery = await userRepository.createResetToken(email);

        if (recovery) {
            const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
            const resetLink = `${baseUrl}/api/sessions/reset-password/${recovery.token}`;
            await mailService.sendPasswordResetEmail(email, resetLink);
        }

        res.json({
            status: 'success',
            message: 'Si el email existe, se envio un enlace para restablecer la contraseña'
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ status: 'error', message: 'La nueva contraseña es obligatoria' });

        await userRepository.resetPassword(req.params.token, password);

        res.json({ status: 'success', message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
});

export default router;
