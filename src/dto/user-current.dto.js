export default class UserCurrentDTO {
    constructor(user) {
        this.id = user._id?.toString() || user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.cart = user.cart?._id?.toString() || user.cart?.toString() || user.cart;
        this.role = user.role;
    }
}
