import ticketDAO from '../dao/ticket.dao.js';

class TicketRepository {
    createTicket(ticketData) {
        return ticketDAO.create(ticketData);
    }
}

export default new TicketRepository();
