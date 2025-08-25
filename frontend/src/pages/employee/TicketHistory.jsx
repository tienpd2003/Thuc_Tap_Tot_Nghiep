import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function TicketHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  // Mock data for now
  useEffect(() => {
    const loadTicketHistory = async () => {
      setLoading(true);
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets([
        {
          id: 1,
          title: 'Laptop không khởi động được',
          status: 'COMPLETED',
          priority: 'HIGH',
          departmentName: 'IT Department',
          createdAt: '2025-08-20T10:00:00Z',
          completedAt: '2025-08-21T14:30:00Z',
          resolution: 'Đã thay thế ổ cứng và cài lại hệ điều hành'
        },
        {
          id: 2,
          title: 'Yêu cầu nghỉ phép',
          status: 'COMPLETED',
          priority: 'MEDIUM',
          departmentName: 'HR Department',
          createdAt: '2025-08-15T09:00:00Z',
          completedAt: '2025-08-16T11:00:00Z',
          resolution: 'Đã phê duyệt nghỉ phép từ 25-30/8'
        },
        {
          id: 3,
          title: 'Hoàn trả chi phí',
          status: 'CANCELLED',
          priority: 'LOW',
          departmentName: 'Finance Department',
          createdAt: '2025-08-10T14:00:00Z',
          completedAt: '2025-08-12T16:00:00Z',
          resolution: 'Không đủ hóa đơn chứng từ'
        },
        {
          id: 4,
          title: 'Cập nhật thông tin cá nhân',
          status: 'COMPLETED',
          priority: 'LOW',
          departmentName: 'HR Department',
          createdAt: '2025-08-05T08:00:00Z',
          completedAt: '2025-08-05T10:30:00Z',
          resolution: 'Đã cập nhật thông tin thành công'
        }
      ]);
      setLoading(false);
    };

    loadTicketHistory();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilteredTickets = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    switch (timeFilter) {
      case 'week':
        return tickets.filter(ticket => new Date(ticket.completedAt) >= sevenDaysAgo);
      case 'month':
        return tickets.filter(ticket => new Date(ticket.completedAt) >= thirtyDaysAgo);
      default:
        return tickets;
    }
  };

  const filteredTickets = getFilteredTickets();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/employee/home')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ticket History</h1>
              <p className="text-gray-600">View your completed and closed tickets</p>
            </div>
          </div>
          
          {/* Time Filter */}
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-500">Loading history...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No tickets found for the selected time period</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(ticket.status)}
                  </div>
                  
                  {/* Ticket Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        TKT-{ticket.id}: {ticket.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <span>Department: {ticket.departmentName}</span>
                      <span>•</span>
                      <span>Created: {formatDate(ticket.createdAt)}</span>
                      <span>•</span>
                      <span>Completed: {formatDate(ticket.completedAt)}</span>
                    </div>
                    
                    {ticket.resolution && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Resolution:</p>
                        <p className="text-sm text-gray-600">{ticket.resolution}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="flex-shrink-0 ml-4">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {!loading && filteredTickets.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredTickets.filter(t => t.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {filteredTickets.filter(t => t.status === 'CANCELLED' || t.status === 'REJECTED').length}
              </div>
              <div className="text-sm text-gray-500">Cancelled/Rejected</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredTickets.length}
              </div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
