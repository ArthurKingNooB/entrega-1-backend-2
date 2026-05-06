import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/user.model.js';
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
