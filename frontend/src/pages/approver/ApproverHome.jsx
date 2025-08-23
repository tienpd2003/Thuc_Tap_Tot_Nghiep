import { 
  MdHeadsetMic, 
  MdAssignment, 
  MdCheckCircle, 
  MdSchedule,
  MdPriorityHigh,
  MdApproval,
  MdReport
} from "react-icons/md";

export default function ApproverHome() {
  const pendingTickets = [
    {
      id: "TKT-001",
      title: "Printer Issue",
      department: "IT",
      priority: "High",
      status: "Pending Approval",
      createdBy: "John Doe",
      createdAt: "2 hours ago",
      description: "Printer is not working, need support to fix"
    },
    {
      id: "TKT-002",
      title: "Software Installation Request",
      department: "IT",
      priority: "Medium",
      status: "Pending Approval",
      createdBy: "Jane Smith",
      createdAt: "4 hours ago",
      description: "Need to install Adobe Photoshop software for design department"
    },
    {
      id: "TKT-003",
      title: "System Error Report",
      department: "Accounting",
      priority: "High",
      status: "Pending Approval",
      createdBy: "Mike Johnson",
      createdAt: "6 hours ago",
      description: "Accounting system has error when exporting reports"
    }
  ];

  const stats = [
    {
      title: "Pending Tickets",
      value: "15",
      change: "+3",
      changeType: "increase",
      icon: <MdApproval className="h-6 w-6" />,
      color: "bg-yellow-500"
    },
    {
      title: "Approved Tickets",
      value: "89",
      change: "+12",
      changeType: "increase",
      icon: <MdCheckCircle className="h-6 w-6" />,
      color: "bg-green-500"
    },
    {
      title: "Rejected Tickets",
      value: "5",
      change: "-2",
      changeType: "decrease",
      icon: <MdPriorityHigh className="h-6 w-6" />,
      color: "bg-red-500"
    },
    {
      title: "Total Tickets",
      value: "109",
      change: "+13",
      changeType: "increase",
      icon: <MdHeadsetMic className="h-6 w-6" />,
      color: "bg-blue-500"
    }
  ];

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

  const handleApprove = (ticketId) => {
    console.log("Approve ticket:", ticketId);
  };

  const handleReject = (ticketId) => {
    console.log("Reject ticket:", ticketId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ticket Approval Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage and approve support requests</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MdSchedule className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleString('en-US')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">today</span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Tickets */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending Tickets</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {pendingTickets.map((ticket) => (
            <div key={ticket.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-[#5e83ae]">{ticket.id}</span>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className="text-sm text-gray-500">• {ticket.department}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{ticket.title}</h3>
                  <p className="text-gray-600 mb-4">{ticket.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Created by: {ticket.createdBy}</span>
                    <span>•</span>
                    <span>{ticket.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-6">
                  <button
                    onClick={() => handleApprove(ticket.id)}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(ticket.id)}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MdAssignment className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">View All Tickets</h3>
          </div>
          <p className="text-gray-600 mb-6">View all tickets in the system</p>
          <button className="w-full bg-[#5e83ae] text-white px-4 py-3 rounded-lg hover:bg-[#4a6b8a] transition-colors font-medium">
            View List
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <MdCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Approved Tickets</h3>
          </div>
          <p className="text-gray-600 mb-6">View history of approved tickets</p>
          <button className="w-full bg-[#5e83ae] text-white px-4 py-3 rounded-lg hover:bg-[#4a6b8a] transition-colors font-medium">
            View History
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <MdReport className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
          </div>
          <p className="text-gray-600 mb-6">View ticket approval statistics</p>
          <button className="w-full bg-[#5e83ae] text-white px-4 py-3 rounded-lg hover:bg-[#4a6b8a] transition-colors font-medium">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
}
