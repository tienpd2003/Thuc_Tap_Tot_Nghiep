import apiClient from './apiClient';

// Get approval statistics for approver dashboard
export const getApprovalStats = async (approverId) => {
  if (!approverId) {
    throw new Error('approverId is required');
  }
  
  try {
    const response = await apiClient.get('/approvals/stats', {
      params: { approverId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    throw error;
  }
};

// Get pending tickets for approver with filters
export const getPendingTickets = async (filters = {}, page = 0, size = 10, approverId) => {
  if (!approverId) {
    throw new Error('approverId is required');
  }
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: filters.sort || 'createdAt,desc',
      approverId: approverId.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      )
    });

    const response = await apiClient.get(`/approvals/pending?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching pending tickets:', error);
    throw error;
  }
};

// Get processed tickets by approver with filters  
export const getProcessedTickets = async (filters = {}, page = 0, size = 10, approverId) => {
  if (!approverId) {
    throw new Error('approverId is required');
  }
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sort: filters.sort || 'createdAt,desc',
      approverId: approverId.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== '')
      )
    });

    const response = await apiClient.get(`/approvals/processed?${params}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching processed tickets:', error);
    throw error;
  }
};

// Get ticket details with approval history
export const getTicketApprovals = async (ticketId) => {
  try {
    const response = await apiClient.get(`/approvals/${ticketId}/detail`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket approvals:', error);
    throw error;
  }
};

// Approve a ticket
export const approveTicket = async (ticketId, taskId, note, actingUserId = '') => {
  try {
    const response = await apiClient.post(`/approvals/${ticketId}/approve`, {
      taskId,
      note,
      actingUserId
    });
    return response.data;
  } catch (error) {
    console.error('Error approving ticket:', error);
    throw error;
  }
};

// Reject a ticket
export const rejectTicket = async (ticketId, taskId, reason) => {
  try {
    const response = await apiClient.post(`/approvals/${ticketId}/reject`, {
      taskId,
      reason
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting ticket:', error);
    throw error;
  }
};

// Forward a ticket to another approver
export const forwardTicket = async (ticketId, taskId, nextApproverId, note = '') => {
  try {
    const response = await apiClient.post(`/approvals/${ticketId}/forward`, {
      taskId,
      nextApproverId,
      note
    });
    return response.data;
  } catch (error) {
    console.error('Error forwarding ticket:', error);
    throw error;
  }
};

export default {
  getApprovalStats,
  getPendingTickets,
  getProcessedTickets,
  getTicketApprovals,
  approveTicket,
  rejectTicket,
  forwardTicket
};
