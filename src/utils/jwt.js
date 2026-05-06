import jwt from 'jsonwebtoken';

export const getJwtSecret = () => process.env.JWT_SECRET || 'secretJWT';

export const generateToken = user => jwt.sign(user, getJwtSecret(), { expiresIn: '1h' });
