import { useState, useEffect } from 'react';
import { 
  MdHeadsetMic, 
  MdAssignment, 
  MdCheckCircle, 
  MdSchedule,
  MdAdd,
  MdHistory,
  MdPriorityHigh
} from "react-icons/md";
import { useAuth } from '../../contexts/AuthContext';
import { getEmployeeDashboard, getEmployeeTickets } from '../../services/employeeService';

export default function EmployeeHome() {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: 0,
    inProgress: 0,
    completed: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadEmployeeData();
    }
  }, [user]);

  const loadEmployeeData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load dashboard stats và recent tickets đồng thời
      const [statsResponse, ticketsResponse] = await Promise.all([
        getEmployeeDashboard(user.id),
        getEmployeeTickets(user.id, { page: 0, size: 5, sortBy: 'createdAt', sortDir: 'desc' })
      ]);

      setDashboardStats(statsResponse);
      setMyTickets(ticketsResponse.content || []);
      
    } catch (err) {
      console.error('Error loading employee data:', err);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Create New Ticket",
      description: "Create a new support request",
      icon: <MdAdd className="h-6 w-6" />,
      color: "bg-blue-500",
      action: () => console.log("Create ticket")
    },
    {
      title: "View My Tickets",
      description: "Track your created tickets",
      icon: <MdAssignment className="h-6 w-6" />,
      color: "bg-green-500",
      action: () => console.log("View tickets")
    },
    {
      title: "Ticket History",
      description: "View ticket history",
      icon: <MdHistory className="h-6 w-6" />,
      color: "bg-purple-500",
      action: () => console.log("History")
    }
  ];

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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
            <div className="flex items-center gap-4">
              <div className={`${action.color} p-4 rounded-xl text-white`}>
                {action.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* My Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Tickets</h2>
            <button className="bg-[#5e83ae] text-white px-6 py-2 rounded-lg hover:bg-[#4a6b8a] transition-colors text-sm font-medium">
              Create New Ticket
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5e83ae]"></div>
                      <span className="ml-2 text-gray-500">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : myTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    Bạn chưa có ticket nào. Hãy tạo ticket đầu tiên!
                  </td>
                </tr>
              ) : (
                myTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5e83ae]">
                      TKT-{ticket.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.departmentName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priorityName || 'Medium')}`}>
                        {ticket.priorityName || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.statusName || 'Pending')}`}>
                        {ticket.statusName || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.assignedToName || 'Chưa phân công'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRelativeTime(ticket.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                {loading ? '...' : dashboardStats.inProgress}
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
              <p className="text-sm font-medium text-gray-600 mb-2">Completed</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : dashboardStats.completed}
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
                {loading ? '...' : dashboardStats.pending}
              </p>
            </div>
            <div className="bg-purple-500 p-4 rounded-xl text-white">
              <MdSchedule className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
