export default class MongoDAO {
    constructor(model) {
        this.model = model;
    }

    getAll(filter = {}) {
        return this.model.find(filter).lean();
    }

    getById(id, populateOptions = null) {
        const query = this.model.findById(id);
        if (populateOptions) query.populate(populateOptions);
        return query.lean();
    }

    getOne(filter = {}) {
        return this.model.findOne(filter).lean();
    }

    create(data) {
        return this.model.create(data);
    }

    update(id, data) {
        return this.model.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
    }

    delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}
