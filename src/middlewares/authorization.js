export const authorization = roles => (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ status: 'error', message: 'No tiene permisos suficientes' });
    }

    next();
};
