import React, { useEffect, useState } from "react";
import { FiSearch, FiFilter, FiEye, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import { Popover } from '@mui/material';
import { getAllFormTemplates } from "../../services/formTemplateService";
import { Link } from "react-router-dom";
import { departmentService, userService } from "../../services";

const FormTemplateList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    keyword: "",
    isActive: "",
    createdById: "",
    approvalDepartmentId: "",
    createdAtFrom: "",
    createdAtTo: "",
    updatedAtFrom: "",
    updatedAtTo: "",
    page: 0,
    pageSize: 10,
    sortBy: "createdAt",
    sortDirection: "desc"
  });

  // Popover states
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const [createdByAnchorEl, setCreatedByAnchorEl] = useState(null);
  const [departmentAnchorEl, setDepartmentAnchorEl] = useState(null);
  const [pageSizeAnchorEl, setPageSizeAnchorEl] = useState(null);

  // Department colors for approval workflow
  const departmentColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-teal-100 text-teal-800',
    'bg-yellow-100 text-yellow-800',
  ];

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Three-state sorting function
  const handleSort = (field) => {
    let newDirection = 'asc';
    if (filters.sortBy === field) {
      if (filters.sortDirection === 'asc') {
        newDirection = 'desc';
      } else if (filters.sortDirection === 'desc') {
        // Third click - remove sorting
        setFilters({
          ...filters,
          sortBy: "createdAt",
          sortDirection: "desc"
        });
        fetchFormTemplates({
          ...filters,
          sortBy: "createdAt",
          sortDirection: "desc"
        });
        return;
      }
    }

    setFilters({
      ...filters,
      sortBy: field,
      sortDirection: newDirection
    });
    fetchFormTemplates({
      ...filters,
      sortBy: field,
      sortDirection: newDirection
    });
  };

  // Get sort icon based on current state
  const getSortIcon = (field) => {
    if (filters.sortBy !== field) {
      return <FiChevronUp className="h-3 w-3 text-white opacity-30" />;
    }

    switch (filters.sortDirection) {
      case 'asc':
        return <FiChevronUp className="h-3 w-3 text-white" />;
      case 'desc':
        return <FiChevronDown className="h-3 w-3 text-white" />;
      default:
        return <FiChevronUp className="h-3 w-3 text-white opacity-30" />;
    }
  };

  // Gọi API lấy danh sách form template với filters
  const fetchFormTemplates = async (filterParams = filters) => {
    try {
      setLoading(true);

      // Lọc bỏ field rỗng/null
      const queryParams = {};
      Object.keys(filterParams).forEach((key) => {
        if (filterParams[key] !== "" && filterParams[key] !== null && filterParams[key] !== undefined) {
          queryParams[key] = filterParams[key];
        }
      });

      const result = await getAllFormTemplates(queryParams);
      setData(result);
    } catch (error) {
      console.error("Failed to fetch form templates", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const result = await departmentService.getAllDepartments()
      setDepartments(result.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const result = await userService.getUsersByRole(3);
      setAdmins(result.data);
    } catch (error) {
      console.error("Failed to fetch admins", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormTemplates();
    fetchDepartments();
    fetchAdmins()
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchFormTemplates({ ...filters, page: 0 });
  };

  const handleResetFilters = () => {
    const resetFilters = {
      keyword: "",
      isActive: "",
      createdById: "",
      approvalDepartmentId: "",
      createdAtFrom: "",
      createdAtTo: "",
      updatedAtFrom: "",
      updatedAtTo: "",
      page: 0,
      pageSize: filters.pageSize,
      sortBy: "createdAt",
      sortDirection: "desc"
    };
    setFilters(resetFilters);
    fetchFormTemplates(resetFilters);
  };

  const handlePageChange = (newPage) => {
    fetchFormTemplates({ ...filters, page: newPage });
  };

  const handlePageSizeChange = (newSize) => {
    fetchFormTemplates({ ...filters, pageSize: newSize, page: 0 });
  };

  // Popover handlers
  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusClose = () => setStatusAnchorEl(null);
  const handleCreatedByClick = (event) => setCreatedByAnchorEl(event.currentTarget);
  const handleCreatedByClose = () => setCreatedByAnchorEl(null);
  const handleDepartmentClick = (event) => setDepartmentAnchorEl(event.currentTarget);
  const handleDepartmentClose = () => setDepartmentAnchorEl(null);
  const handlePageSizeClick = (event) => setPageSizeAnchorEl(event.currentTarget);
  const handlePageSizeClose = () => setPageSizeAnchorEl(null);

  if (!data && loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e83ae]"></div>
    </div>
  );

  const { content, number, totalPages, totalElements, first, last, size } = data || {};

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w mx-auto">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiFilter className="h-5 w-5" />
              Filters
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-[#5e83ae] text-white rounded-lg hover:bg-[#4a6b8a] transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-[#5e83ae] text-[#5e83ae] rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Main Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Keyword Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => handleFilterChange("keyword", e.target.value)}
                  placeholder="Search by name or description"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
                />
              </div>
            </div>

            {/* Status Filter - Popover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <button
                onClick={handleStatusClick}
                className="w-full text-left px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
              >
                <span className={filters.isActive === "" ? "text-gray-500" : "text-gray-900"}>
                  {filters.isActive === "" ? "All Status" :
                    filters.isActive === "true" ? "Active" : "Inactive"}
                </span>
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <Popover
                open={Boolean(statusAnchorEl)}
                anchorEl={statusAnchorEl}
                onClose={handleStatusClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              >
                <div className="p-2 min-w-[200px]">
                  <button
                    onClick={() => { handleFilterChange("isActive", ""); handleStatusClose(); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => { handleFilterChange("isActive", "true"); handleStatusClose(); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => { handleFilterChange("isActive", "false"); handleStatusClose(); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    Inactive
                  </button>
                </div>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Created By</label>
              <button
                onClick={handleCreatedByClick}
                className="w-full text-left px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
              >
                <span className={filters.createdById === "" ? "text-gray-500" : "text-gray-900"}>
                  {filters.createdById === "" ? "Select Admin" :
                    admins.find(a => a.id == filters.createdById)?.fullName || "Unknown"}
                </span>
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <Popover
                open={Boolean(createdByAnchorEl)}
                anchorEl={createdByAnchorEl}
                onClose={handleCreatedByClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <div className="p-2 min-w-[250px] max-h-60 overflow-y-auto">
                  <button
                    onClick={() => { handleFilterChange("createdById", ""); handleCreatedByClose(); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    All Admins
                  </button>
                  {admins.map((admin) => (
                    <button
                      key={admin.id}
                      onClick={() => { handleFilterChange("createdById", admin.id); handleCreatedByClose(); }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                    >
                      {admin.fullName || admin.username}
                    </button>
                  ))}
                </div>
              </Popover>
            </div>

            {/* Department Filter - Popover */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Approval Department</label>
              <button
                onClick={handleDepartmentClick}
                className="w-full text-left px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
              >
                <span className={filters.approvalDepartmentId === "" ? "text-gray-500" : "text-gray-900"}>
                  {filters.approvalDepartmentId === "" ? "Select Department" :
                    departments.find(d => d.id == filters.approvalDepartmentId)?.name || "Unknown"}
                </span>
                <FiChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              <Popover
                open={Boolean(departmentAnchorEl)}
                anchorEl={departmentAnchorEl}
                onClose={handleDepartmentClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <div className="p-3 border-b border-gray-100">
                  <button
                    onClick={() => { handleFilterChange("approvalDepartmentId", ""); handleDepartmentClose(); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                  >
                    All Departments
                  </button>
                  {departments.map((department) => (
                    <button
                      key={department.id}
                      onClick={() => { handleFilterChange("approvalDepartmentId", department.id); handleDepartmentClose(); }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                    >
                      {department.name}
                    </button>
                  ))}
                </div>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created From</label>
                <input
                  type="date"
                  value={filters.createdAtFrom}
                  onChange={(e) => handleFilterChange("createdAtFrom", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Created To</label>
                <input
                  type="date"
                  value={filters.createdAtTo}
                  onChange={(e) => handleFilterChange("createdAtTo", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Updated From</label>
                <input
                  type="date"
                  value={filters.updatedAtFrom}
                  onChange={(e) => handleFilterChange("updatedAtFrom", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Updated To</label>
                <input
                  type="date"
                  value={filters.updatedAtTo}
                  onChange={(e) => handleFilterChange("updatedAtTo", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#5e83ae]">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <div className="flex items-center">
                      Form Template Details
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('createdById')}
                      className="flex items-center hover:bg-[#4a6b8a] px-2 py-1 rounded transition-colors"
                    >
                      Created By
                      <div className="ml-1">
                        {getSortIcon('createdById')}
                      </div>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('isActive')}
                      className="flex items-center hover:bg-[#4a6b8a] px-2 py-1 rounded transition-colors"
                    >
                      Status
                      <div className="ml-1">
                        {getSortIcon('isActive')}
                      </div>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center hover:bg-[#4a6b8a] px-2 py-1 rounded transition-colors"
                    >
                      Created
                      <div className="ml-1">
                        {getSortIcon('createdAt')}
                      </div>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('updatedAt')}
                      className="flex items-center hover:bg-[#4a6b8a] px-2 py-1 rounded transition-colors"
                    >
                      Updated
                      <div className="ml-1">
                        {getSortIcon('updatedAt')}
                      </div>
                    </button>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {!content || content.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {loading ? (
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#5e83ae]"></div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <FiX className="h-12 w-12 text-gray-300 mb-2" />
                          <p className="text-lg font-medium text-gray-400">No form templates found</p>
                          <p className="text-sm text-gray-400">Try adjusting your filters</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  content.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {number * size + index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-3">
                          <div className="flex flex-col">
                            <span className="text-lg font-semibold text-[#5e83ae]">{item.name}</span>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs font-medium text-gray-500 block mb-2">Approval Workflow:</span>
                            <div className="flex items-center flex-wrap gap-2">
                              {item.approvalDepartments && item.approvalDepartments.map((dept, idx) => (
                                <React.Fragment key={idx}>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${departmentColors[idx % departmentColors.length]}`}>
                                    {dept}
                                  </span>
                                  {idx < item.approvalDepartments.length - 1 && (
                                    <span className="text-gray-400 text-xs">→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <div className="font-medium">{item.createdByFullName}</div>
                          <div className="text-gray-500 text-xs">@{item.createdByUsername}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}>
                          {item.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">{formatDate(item.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="font-medium">{formatDate(item.updatedAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/form-templates/${item.id}/view`}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            title="View details"
                          >
                            <FiEye className="h-4 w-4" />
                          </Link>
                          <button
                            className="text-green-600 hover:text-green-900 p-2 rounded-lg hover:bg-green-50 transition-colors"
                            title="Edit"
                          >
                            <FiEdit className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {content && content.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <button
                  onClick={handlePageSizeClick}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  {filters.pageSize}
                  <FiChevronDown className="h-3 w-3" />
                </button>
                <Popover
                  open={Boolean(pageSizeAnchorEl)}
                  anchorEl={pageSizeAnchorEl}
                  onClose={handlePageSizeClose}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                >
                  <div className="p-2">
                    {[5, 10, 25, 50].map((size) => (
                      <button
                        key={size}
                        onClick={() => { handlePageSizeChange(size); handlePageSizeClose(); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </Popover>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={first}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 transition-colors"
                  title="First page"
                >
                  <FiChevronsLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(number - 1)}
                  disabled={first}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Previous page"
                >
                  <FiChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex space-x-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i;
                    } else if (number < 3) {
                      pageNum = i;
                    } else if (number > totalPages - 4) {
                      pageNum = totalPages - 5 + i;
                    } else {
                      pageNum = number - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-md text-sm transition-colors ${number === pageNum
                          ? "bg-[#5e83ae] text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(number + 1)}
                  disabled={last}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Next page"
                >
                  <FiChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={last}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 hover:bg-gray-100 transition-colors"
                  title="Last page"
                >
                  <FiChevronsRight className="h-4 w-4" />
                </button>
              </div>

              {data && (
                <div className="text-sm text-gray-600">
                  View {number * size + 1} - {Math.min((number + 1) * size, totalElements)} of {totalElements} results
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormTemplateList;