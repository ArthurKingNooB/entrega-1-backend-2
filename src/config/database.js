import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/backend-ecommerce';

    try {
        await mongoose.connect(mongoUrl, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('MongoDB conectado');
    } catch (error) {
        console.error('Error al conectar MongoDB:', error.message);
        process.exit(1);
    }
};
