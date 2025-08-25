import apiClient from './apiClient';

export const ticketService = {
  // Create ticket from template
  createTicketFromTemplate: async (ticketData) => {
    const response = await apiClient.post('/tickets/from-template', ticketData);
    return response.data;
  },

  // Get employee tickets
  getEmployeeTickets: async (employeeId, params = {}) => {
    const response = await apiClient.get(`/tickets/employee/${employeeId}`, { params });
    return response.data;
  },

  // Get ticket by ID
  getTicketById: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}`);
    return response.data;
  },

  // Update ticket
  updateTicket: async (ticketId, ticketData) => {
    const response = await apiClient.put(`/tickets/${ticketId}`, ticketData);
    return response.data;
  },

  // Delete ticket
  deleteTicket: async (ticketId) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`);
    return response.data;
  }
};

export default ticketService;
