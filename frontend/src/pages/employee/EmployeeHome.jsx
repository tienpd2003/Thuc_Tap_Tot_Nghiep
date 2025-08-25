import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdHeadsetMic, 
  MdAssignment, 
  MdCheckCircle, 
  MdSchedule,
  MdVisibility
} from "react-icons/md";
import { useAuth } from '../../contexts/AuthContext';
import { getEmployeeDashboard, getEmployeeTickets, deleteTicket } from '../../services/employeeService';

export default function EmployeeHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myTickets, setMyTickets] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10
  });
  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    approvedTickets: 0,
    rejectedTickets: 0,
    inProgressTickets: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadEmployeeData();
    }
  }, [user]);

  const loadEmployeeData = async (page = 0) => {
    try {
      setLoading(true);
      setError("");

      // Load dashboard stats và recent tickets đồng thời
      const [statsResponse, ticketsResponse] = await Promise.all([
        getEmployeeDashboard(user.id),
        getEmployeeTickets(user.id, { page, size: pagination.size, sortBy: 'createdAt', sortDir: 'desc' })
      ]);

      console.log('Dashboard Stats Response:', statsResponse);
      console.log('Tickets Response:', ticketsResponse);
      
      setDashboardStats(statsResponse);
      setMyTickets(ticketsResponse.content || []);
      setPagination({
        currentPage: ticketsResponse.number || 0,
        totalPages: ticketsResponse.totalPages || 0,
        totalElements: ticketsResponse.totalElements || 0,
        size: ticketsResponse.size || 10
      });
      
    } catch (err) {
      console.error('Error loading employee data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Removed quick actions as requested

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadEmployeeData(newPage);
    }
  };

  const isPending = (t) => {
    const s = (t?.statusName || t?.currentStatusName || t?.status || '').toString().toUpperCase();
    return s === 'PENDING' || s === 'PENDING_APPROVAL';
  };

  const handleDelete = async (ticketId) => {
    if (!ticketId || !user?.id) return;
    if (!confirm('Bạn có chắc muốn xóa ticket này?')) return;
    try {
      setDeletingId(ticketId);
      await deleteTicket(ticketId, user.id);
      // refresh current page
      await loadEmployeeData(pagination.currentPage);
    } catch (e) {
      console.error('Delete ticket failed', e);
      alert('Xóa ticket thất bại. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING":
      case "PENDING_APPROVAL":
      case "PENDING APPROVAL":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toUpperCase()) {
      case "HIGH":
      case "URGENT":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
      case "NORMAL":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Vừa xong';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#5e83ae] to-[#4a6b8a] rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back{user?.fullName ? `, ${user.fullName}` : ''}!</h1>
            <p className="text-blue-100 text-lg">TicketHub is ready to support you</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Today</p>
            <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US')}</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Lỗi:</p>
          <p>{error}</p>
          <button 
            onClick={loadEmployeeData}
            className="mt-2 text-red-600 hover:text-red-800 underline"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Tickets</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : dashboardStats.totalTickets}
              </p>
            </div>
            <div className="bg-blue-500 p-4 rounded-xl text-white">
              <MdHeadsetMic className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : dashboardStats.inProgressTickets || 0}
              </p>
            </div>
            <div className="bg-yellow-500 p-4 rounded-xl text-white">
              <MdAssignment className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Approved</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : dashboardStats.approvedTickets || 0}
              </p>
            </div>
            <div className="bg-green-500 p-4 rounded-xl text-white">
              <MdCheckCircle className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : dashboardStats.pendingTickets || 0}
              </p>
            </div>
            <div className="bg-purple-500 p-4 rounded-xl text-white">
              <MdSchedule className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : dashboardStats.rejectedTickets || 0}
              </p>
            </div>
            <div className="bg-red-500 p-4 rounded-xl text-white">
              <MdSchedule className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* My Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Tickets</h2>
            <button 
              onClick={() => navigate('/employee/tickets/create')}
              className="bg-[#5e83ae] text-white px-4 py-2 rounded-lg hover:bg-[#4a6b8a] transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <span>+</span>
              <span>Create New Ticket</span>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated At
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5e83ae]"></div>
                      <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : myTickets.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                    Bạn chưa có ticket nào. Hãy tạo ticket đầu tiên!
                  </td>
                </tr>
              ) : (
                myTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5e83ae]">
                      {ticket.ticketCode || `TKT-${ticket.id}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.currentStatusName || ticket.statusName || 'Pending')}`}>
                        {ticket.currentStatusName || ticket.statusName || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priorityName || 'Medium')}`}>
                        {ticket.priorityName || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => navigate(`/employee/tickets/${ticket.id}`)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                        title="View ticket details"
                      >
                        <MdVisibility className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      {isPending(ticket) && (
                        <>
                          <button
                            onClick={() => navigate(`/employee/tickets/${ticket.id}?edit=1`)}
                            className="text-gray-700 hover:text-gray-900 inline-flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                            title="Edit ticket"
                          >
                            ✎ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            disabled={deletingId === ticket.id}
                            className="text-red-600 hover:text-red-800 inline-flex items-center space-x-1 px-3 py-1 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete ticket"
                          >
                            {deletingId === ticket.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(pagination.currentPage * pagination.size) + 1} to {Math.min((pagination.currentPage + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} tickets
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 0}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {/* Page Numbers */}
              {[...Array(pagination.totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    index === pagination.currentPage
                      ? 'bg-[#5e83ae] text-white border-[#5e83ae]'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= pagination.totalPages - 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
