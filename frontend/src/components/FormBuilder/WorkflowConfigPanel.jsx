import React, { useEffect, useState } from "react";
import { MdClose, MdDownloadDone } from "react-icons/md";
import { Popover } from '@mui/material';

const WorkflowConfigPanel = ({ step, onSave, onCancel, departments = [] }) => {
  const [config, setConfig] = useState(step || {
    stepOrder: 1,
    departmentId: '',
    stepName: ''
  });

  const [deptAnchorEl, setDeptAnchorEl] = useState(null);

  useEffect(() => {
    if (step) {
      setConfig(step);
    }
  }, [step]);

  const handleConfigChange = (updates) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleDeptClick = (event) => {
    setDeptAnchorEl(event.currentTarget);
  };

  const handleDeptClose = () => setDeptAnchorEl(null);

  const handleSelectDept = (deptId) => {
    handleConfigChange({ departmentId: deptId });
    handleDeptClose();
  };

  const openDept = Boolean(deptAnchorEl);

  const selectedDept = departments.find(d => d.id === config.departmentId);

  return (
    <div className="w-64 bg-gray-50 p-4 border-l border-gray-200 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Workflow Step</h3>
        <div className="flex">
          <button
            onClick={() => {
              if (config.stepName && config.departmentId) {
                onSave(config);
              }
              onCancel();
            }}
            className="p-1 text-gray-500 hover:text-green-500"
            title="Save"
          >
            <MdDownloadDone size={20} />
          </button>
          <button
            onClick={onCancel}
            className="p-1 text-gray-500 hover:text-red-500"
            title="Cancel"
          >
            <MdClose size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Step Order */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Step Order
          </label>
          <input
            type="number"
            min={1}
            value={config.stepOrder || 1}
            onChange={(e) =>
              handleConfigChange({ stepOrder: parseInt(e.target.value || 1) })
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae]"
          />
        </div>

        {/* Step Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Step Name
          </label>
          <input
            type="text"
            value={config.stepName || ""}
            onChange={(e) => handleConfigChange({ stepName: e.target.value })}
            placeholder="e.g., Manager Approval"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae]"
          />
        </div>

        {/* Department as Popover */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Department
          </label>

          <button
            onClick={handleDeptClick}
            className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-between text-sm"
            aria-haspopup="true"
            aria-expanded={openDept ? "true" : "false"}
          >
            <span className={selectedDept ? "text-gray-900" : "text-gray-500"}>
              {selectedDept ? selectedDept.name : "Select Department"}
            </span>
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Popover
            open={openDept}
            anchorEl={deptAnchorEl}
            onClose={handleDeptClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            classes={{ paper: '' }}
          >
            <div className="p-2 max-h-60 overflow-auto">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(dept.id)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center justify-between"
                >
                  <span>{dept.name}</span>
                  {config.departmentId === dept.id && (
                    <svg className="w-4 h-4 text-[#5e83ae]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default WorkflowConfigPanel;
