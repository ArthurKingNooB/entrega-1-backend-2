import passport from 'passport';

export const passportCall = strategy => (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
        if (error) return next(error);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'No autorizado'
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};
