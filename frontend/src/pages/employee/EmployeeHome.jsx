import { 
  MdHeadsetMic, 
  MdAssignment, 
  MdCheckCircle, 
  MdSchedule,
  MdAdd,
  MdHistory,
  MdPriorityHigh
} from "react-icons/md";

export default function EmployeeHome() {
  const myTickets = [
    {
      id: "TKT-001",
      title: "Printer Issue",
      department: "IT",
      priority: "High",
      status: "In Progress",
      createdAt: "2 hours ago",
      assignedTo: "John Smith"
    },
    {
      id: "TKT-002",
      title: "Software Installation Request",
      department: "IT",
      priority: "Medium",
      status: "Pending Approval",
      createdAt: "4 hours ago",
      assignedTo: "Awaiting Assignment"
    },
    {
      id: "TKT-003",
      title: "System Error Report",
      department: "Accounting",
      priority: "High",
      status: "Completed",
      createdAt: "1 day ago",
      assignedTo: "Sarah Wilson"
    }
  ];

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
    switch (status) {
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending Approval":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#5e83ae] to-[#4a6b8a] rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-blue-100 text-lg">HelpDesk Pro is ready to support you</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100 mb-1">Today</p>
            <p className="text-xl font-semibold">{new Date().toLocaleDateString('en-US')}</p>
          </div>
        </div>
      </div>

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
              {myTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#5e83ae]">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.assignedTo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.createdAt}
                  </td>
                </tr>
              ))}
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
              <p className="text-3xl font-bold text-gray-900">12</p>
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
              <p className="text-3xl font-bold text-gray-900">3</p>
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
              <p className="text-3xl font-bold text-gray-900">8</p>
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
              <p className="text-3xl font-bold text-gray-900">1</p>
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
