import MongoDAO from './mongo.dao.js';
import UserModel from '../models/user.model.js';

class UserDAO extends MongoDAO {
    constructor() {
        super(UserModel);
    }

    getByEmail(email) {
        return this.model.findOne({ email });
    }

    getByResetToken(resetPasswordToken) {
        return this.model.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });
    }
}

export default new UserDAO();
