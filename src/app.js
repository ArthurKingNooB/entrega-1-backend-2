import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import { connectDB } from './config/database.js';
import initializePassport from './config/passport.config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
initializePassport();
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

await connectDB();

app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
