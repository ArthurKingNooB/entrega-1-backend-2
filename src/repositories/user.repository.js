import crypto from 'crypto';
import userDAO from '../dao/user.dao.js';
import cartRepository from './cart.repository.js';
import UserCurrentDTO from '../dto/user-current.dto.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';

class UserRepository {
    async createUser(userData) {
        const exists = await userDAO.getByEmail(userData.email);
        if (exists) throw new Error('El email ya esta registrado');

        const cart = await cartRepository.createCart();
        return userDAO.create({
            ...userData,
            password: createHash(userData.password),
            cart: cart._id
        });
    }

    getUserByEmail(email) {
        return userDAO.getByEmail(email);
    }

    async getUserById(id) {
        return userDAO.getById(id, 'cart');
    }

    toCurrentDTO(user) {
        return new UserCurrentDTO(user);
    }

    async createResetToken(email) {
        const user = await userDAO.getByEmail(email);
        if (!user) return null;

        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
        await user.save();

        return { user, token };
    }

    async resetPassword(token, newPassword) {
        const user = await userDAO.getByResetToken(token);
        if (!user) throw new Error('El enlace es invalido o expiro');

        if (isValidPassword(newPassword, user.password)) {
            throw new Error('No puede usar la misma contraseña anterior');
        }

        user.password = createHash(newPassword);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return user;
    }
}

export default new UserRepository();
