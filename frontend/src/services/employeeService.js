import apiClient from './apiClient';

// Employee Dashboard API
export const getEmployeeDashboard = async (employeeId) => {
  const response = await apiClient.get(`/employee/${employeeId}/dashboard`);
  return response.data;
};

// Employee Tickets API
export const getEmployeeTickets = async (employeeId, options = {}) => {
  const {
    page = 0,
    size = 10,
    sortBy = 'createdAt',
    sortDir = 'desc'
  } = options;
  
  const response = await apiClient.get(`/employee/${employeeId}/tickets`, {
    params: { page, size, sortBy, sortDir }
  });
  return response.data;
};

// Get tickets by status
export const getEmployeeTicketsByStatus = async (employeeId, statusName) => {
  const response = await apiClient.get(`/employee/${employeeId}/tickets/status/${statusName}`);
  return response.data;
};

// Search tickets
export const searchEmployeeTickets = async (employeeId, keyword) => {
  const response = await apiClient.get(`/employee/${employeeId}/tickets/search`, {
    params: { keyword }
  });
  return response.data;
};

// Get tickets by date range
export const getEmployeeTicketsByDateRange = async (employeeId, startDate, endDate) => {
  const response = await apiClient.get(`/employee/${employeeId}/tickets/dateRange`, {
    params: { 
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  });
  return response.data;
};

// Ticket CRUD operations
export const createTicket = async (ticketData) => {
  const response = await apiClient.post('/tickets', ticketData);
  return response.data;
};

export const getTicketById = async (ticketId) => {
  const response = await apiClient.get(`/tickets/${ticketId}`);
  return response.data;
};

export const updateTicket = async (ticketId, employeeId, ticketData) => {
  const response = await apiClient.put(`/tickets/${ticketId}/employee/${employeeId}`, ticketData);
  return response.data;
};

export const deleteTicket = async (ticketId, employeeId) => {
  const response = await apiClient.delete(`/tickets/${ticketId}/employee/${employeeId}`);
  return response.data;
};

// Ticket Form Data
export const getTicketFormData = async (ticketId) => {
  const response = await apiClient.get(`/tickets/${ticketId}/form-data`);
  return response.data;
};

export const saveTicketFormData = async (ticketId, formDataList) => {
  const response = await apiClient.post(`/tickets/${ticketId}/form-data`, formDataList);
  return response.data;
};

export const updateTicketFormData = async (ticketId, formDataList) => {
  const response = await apiClient.put(`/tickets/${ticketId}/form-data`, formDataList);
  return response.data;
};
