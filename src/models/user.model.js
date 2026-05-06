import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
