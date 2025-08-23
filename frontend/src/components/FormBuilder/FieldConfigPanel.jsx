import React, { useEffect, useState } from "react";
import { FaChevronDown, FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { Popover } from '@mui/material';
import { MdAdd, MdClose, MdDownloadDone } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";

const FieldConfigPanel = ({ field, onSave, onCancel }) => {
  const [config, setConfig] = useState(field || {
    key: '',
    label: '',
    type: 'TEXT',
    validation: {},
    ui: { colSpan: 12 }
  });

  const [typeAnchorEl, setTypeAnchorEl] = useState(null);

  const fieldTypes = [
    { value: "TEXT", label: "Text Input" },
    { value: "NUMBER", label: "Number Input" },
    { value: "EMAIL", label: "Email Input" },
    { value: "PHONE", label: "Phone Input" },
    { value: "DATE", label: "Date Picker" },
    { value: "DATETIME", label: "DateTime Picker" },
    { value: "TEXTAREA", label: "Text Area" },
    { value: "SELECT", label: "Dropdown" },
    { value: "RADIO", label: "Radio Group" },
    { value: "CHECKBOX", label: "Checkbox" },
    { value: "FILE", label: "File Upload" }
  ];

  useEffect(() => {
    if (field) {
      setConfig(field);
    }
  }, [field]);

  // Tạm thời bỏ real-time update để test
  // useEffect(() => {
  //   if (config.key && config.label && field) {
  //     const hasChanges = JSON.stringify(config) !== JSON.stringify(field);
  //     if (hasChanges) {
  //       onSave(config);
  //     }
  //   }
  // }, [config.key, config.label, config.type, config.validation, config.ui, config.options, config.helpText]);

  const handleConfigChange = (updates) => {
    setConfig(prev => {
      const newConfig = { ...prev, ...updates };
      
      // Nếu thay đổi type thành SELECT hoặc RADIO và chưa có options, khởi tạo options
      if ((updates.type === 'SELECT' || updates.type === 'RADIO') && !newConfig.options) {
        newConfig.options = [];
      }
      
      return newConfig;
    });
  };

  const handleUIConfigChange = (updates) => {
    setConfig(prev => ({
      ...prev,
      ui: { ...prev.ui, ...updates }
    }));
  };

  const handleTypeClick = (event) => setTypeAnchorEl(event.currentTarget);
  const handleTypeClose = () => setTypeAnchorEl(null);

  console.log('FieldConfigPanel rendering with field:', field);
  
  return (
    <div className="w-64 bg-gray-50 p-4 border-l border-gray-200 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Properties</h3>
        <div className="flex">
        <button
          onClick={() => {
            if (config.key && config.label) {
              onSave(config);
              onCancel(); // Chỉ close khi save thành công
            } else {
              // Hiển thị thông báo lỗi hoặc highlight các field bắt buộc
              console.log('Please fill in required fields');
            }
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
        {/* Field Key */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Field Key</label>
          <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600">
            {config.key || 'Auto-generated'}
          </div>
        </div>

        {/* Field Label */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Field Label</label>
          <input
            type="text"
            value={config.label}
            onChange={(e) => handleConfigChange({ label: e.target.value })}
            placeholder="e.g., First Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
          />
        </div>

        {/* Field Type - Popover */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Field Type</label>
          <button
            onClick={handleTypeClick}
            className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
          >
            <span className="text-gray-900">
              {fieldTypes.find(t => t.value === config.type)?.label || 'Select Type'}
            </span>
            <FaChevronDown className="h-4 w-4 text-gray-400" />
          </button>
          <Popover
            open={Boolean(typeAnchorEl)}
            anchorEl={typeAnchorEl}
            onClose={handleTypeClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
          >
            <div className="p-2 max-h-50">
              {fieldTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    handleConfigChange({ type: type.value });
                    handleTypeClose();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center gap-2"
                >
                  {type.label}
                </button>
              ))}
            </div>
          </Popover>
        </div>

        {/* Options for dropdown/radio */}
        {['SELECT', 'RADIO'].includes(config.type) && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Options</label>
            <div className="space-y-2">
              {(config.options || []).map((option, index) => (
                <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    placeholder="Option label"
                    value={option.label || ""}
                    onChange={(e) => {
                      const newOptions = [...(config.options || [])];
                      const label = e.target.value;
                      // Tự động tạo value từ label (lowercase, no spaces, no special chars)
                      const value = label.toLowerCase().replace(/[^a-z0-9]/g, "_");
                      newOptions[index] = { ...newOptions[index], label, value };
                      handleConfigChange({ options: newOptions });
                    }}
                    className="w-full pr-7 px-2 py-1 border border-gray-300 rounded text-sm "
                  />
                  <button
                    onClick={() => {
                      const newOptions = (config.options || []).filter((_, i) => i !== index);
                      handleConfigChange({ options: newOptions });
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700"
                    title="Remove option"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              ))}
              <button
                onClick={() => {
                  handleConfigChange({
                    options: [...(config.options || []), { value: '', label: '' }]
                  });
                }}
                className="flex items-center gap-1 px-2 py-1 text-sm text-[#5e83ae] hover:text-[#4a6b8a]"
              >
                <MdAdd size={18} />
                Add Option
              </button>
            </div>
          </div>
        )}

        {/* Validation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
            <button
              type="button"
              onClick={() => handleConfigChange({
                validation: { ...config.validation, required: !config.validation?.required }
              })}
              className="flex items-center justify-center"
            >
              {config.validation?.required ? (
                <FaCheckSquare className="h-4 w-4 text-[#5e83ae]" />
              ) : (
                <FaRegSquare className="h-4 w-4 text-gray-400" />
              )}
            </button>
            Required Field
          </label>
        </div>
          
          {/* Column Span */}
          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Column Span (1-12)</label>
            <input
              type="number"
              min="1"
              max="12"
              value={config.ui?.colSpan || 12}
              onChange={(e) => handleUIConfigChange({ colSpan: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
            />
          </div>


          {/* Rows (for textarea) */}
          {config.type === 'TEXTAREA' && (
            <div className="mb-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Rows</label>
              <input
                type="number"
                min="1"
                max="20"
                value={config.ui?.rows || 3}
                onChange={(e) => handleUIConfigChange({ rows: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm"
              />
            </div>
          )}

        {/* Help Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Help Text</label>
          <textarea
            value={config.helpText || ''}
            onChange={(e) => handleConfigChange({ helpText: e.target.value })}
            placeholder="Optional help text for users"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default FieldConfigPanel;
