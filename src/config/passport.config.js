import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import CartModel from '../models/cart.model.js';
import UserModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils/bcrypt.js';
import { getJwtSecret } from '../utils/jwt.js';

const cookieExtractor = req => {
    if (req?.cookies?.coderCookieToken) return req.cookies.coderCookieToken;
    return null;
};

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        cookieExtractor
    ]),
    secretOrKeyProvider: (req, rawJwtToken, done) => {
        done(null, getJwtSecret());
    }
};

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age, role } = req.body;

            if (!first_name || !last_name || !email || !age || !password) {
                return done(null, false, { message: 'Faltan campos obligatorios' });
            }

            const exists = await UserModel.findOne({ email });
            if (exists) {
                return done(null, false, { message: 'El email ya esta registrado' });
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

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email }).lean();
            if (!user || !isValidPassword(password, user.password)) {
                return done(null, false, { message: 'Credenciales invalidas' });
            }

            delete user.password;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await UserModel.findById(jwtPayload.id).populate('cart').lean();
            if (!user) return done(null, false, { message: 'Usuario no encontrado' });

            delete user.password;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('current', new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
            const user = await UserModel.findById(jwtPayload.id).populate('cart').lean();
            if (!user) return done(null, false, { message: 'Token invalido o usuario inexistente' });

            delete user.password;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;
