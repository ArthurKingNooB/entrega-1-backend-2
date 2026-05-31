import MongoDAO from './mongo.dao.js';
import TicketModel from '../models/ticket.model.js';

class TicketDAO extends MongoDAO {
    constructor() {
        super(TicketModel);
    }
}

export default new TicketDAO();
