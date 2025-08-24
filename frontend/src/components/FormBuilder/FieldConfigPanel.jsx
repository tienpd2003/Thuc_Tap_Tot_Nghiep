import React, { useEffect, useState } from "react";
import { FaChevronDown, FaCheckSquare, FaRegSquare } from "react-icons/fa";
import { Popover } from "@mui/material";
import { MdAdd, MdClose, MdDownloadDone } from "react-icons/md";
import { FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import predefinedAsyncOptions from "../../constants/predefinedAsyncOptions";


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
    { value: "FILE", label: "File Upload" },
  ];


const COMMON_PATTERNS = [
  { value: "", label: "Custom Pattern", pattern: "" },
  {
    value: "email",
    label: "Email",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  },
  {
    value: "phone_vn",
    label: "Số điện thoại Việt Nam",
    pattern: "^(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})$",
  },
  {
    value: "url",
    label: "URL",
    pattern:
      "https?://(?:www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$",
  },
  {
    value: "number_only",
    label: "Chỉ số",
    pattern: "^[0-9]*$",
  },
  {
    value: "letters_only",
    label: "Chỉ chữ cái",
    pattern: "^[a-zA-ZÀ-ỹ\\s]*$",
  },
  {
    value: "no_special_chars",
    label: "Không ký tự đặc biệt",
    pattern: "^[a-zA-Z0-9À-ỹ\\s]*$",
  },
];

const OPERATORS_WITH_LABELS = [
  { value: "eq", label: "Bằng" },
  { value: "neq", label: "Không bằng" },
  { value: "gt", label: "Lớn hơn" },
  { value: "gte", label: "Lớn hơn hoặc bằng" },
  { value: "lt", label: "Nhỏ hơn" },
  { value: "lte", label: "Nhỏ hơn hoặc bằng" },
  { value: "in", label: "Trong danh sách" },
  { value: "not_in", label: "Không trong danh sách" },
  { value: "contains", label: "Chứa" },
  { value: "regex", label: "Khớp regex" },
];

const FILE_TYPE = {
  Images: [
    { label: "PNG", value: "image/png" },
    { label: "JPEG", value: "image/jpeg" },
    { label: "JPG", value: "image/jpg" },
    { label: "GIF", value: "image/gif" },
  ],
  Documents: [
    { label: "PDF", value: "application/pdf" },
    { label: "DOC", value: "application/msword" },
    { label: "DOCX", value: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
  ],
  Spreadsheets: [
    { label: "XLS", value: "application/vnd.ms-excel" },
    { label: "XLSX", value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { label: "CSV", value: "text/csv" },
  ],
  Presentations: [
    { label: "PPT", value: "application/vnd.ms-powerpoint" },
    { label: "PPTX", value: "application/vnd.openxmlformats-officedocument.presentationml.presentation" },
  ],
  Others: [
    { label: "TXT", value: "text/plain" },
    { label: "ZIP", value: "application/zip" },
    { label: "JSON", value: "application/json" },
  ],
};

const FieldConfigPanel = ({ field, onSave, onCancel, existingFields = [] }) => {
  const [config, setConfig] = useState(
    field || {
      key: "",
      label: "",
      type: "TEXT",
      validation: {},
      ui: { colSpan: 12 },
    }
  );

  const [typeAnchorEl, setTypeAnchorEl] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    ui: true,
    validation: false,
    staticOptions: false,
    asyncOptions: false,
    visibility: false,
  });

  const [selectedPattern, setSelectedPattern] = useState("");

  
  useEffect(() => {
    if (field) {
      setConfig(field);

      // Set selected pattern based on current validation pattern
      if (field.validation?.pattern) {
        const foundPattern = COMMON_PATTERNS.find(
          (p) => p.pattern === field.validation.pattern
        );
        setSelectedPattern(foundPattern ? foundPattern.value : "");
      } else {
        setSelectedPattern("");
      }
    }
  }, [field]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleConfigChange = (updates) => {
    setConfig((prev) => {
      const newConfig = { ...prev, ...updates };

      // Nếu thay đổi type thành SELECT hoặc RADIO và chưa có options, khởi tạo options
      if (
        (updates.type === "SELECT" || updates.type === "RADIO") &&
        !newConfig.options
      ) {
        newConfig.options = [];
      }

      return newConfig;
    });
  };

  const handleUIConfigChange = (updates) => {
    setConfig((prev) => ({
      ...prev,
      ui: { ...prev.ui, ...updates },
    }));
  };

  const handleValidationChange = (updates) => {
    setConfig((prev) => ({
      ...prev,
      validation: { ...prev.validation, ...updates },
    }));
  };

  const handleAsyncOptionsChange = (optionId) => {
    if (!optionId) {
      // Xóa async options nếu chọn "None"
      setConfig((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          asyncOptions: undefined,
        },
      }));
      return;
    }

    if (optionId === "custom") {
      // Chọn custom → gán asyncOptions trống cho user tự điền
      setConfig((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          asyncOptions: {
            endpoint: "",
            method: "GET",
            dataPath: "",
          },
        },
      }));
      return;
    }

    // Tìm option được chọn từ danh sách định nghĩa sẵn
    const selectedOption = predefinedAsyncOptions.find(
      (opt) => opt.id === optionId
    );

    if (selectedOption) {
      setConfig((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          asyncOptions: {
            endpoint: selectedOption.endpoint,
            method: selectedOption.method,
            dataPath: selectedOption.dataPath,
          },
        },
      }));
    }
  };

  const handlePatternChange = (patternValue) => {
    setSelectedPattern(patternValue);

    if (patternValue === "") {
      // Nếu chọn Custom Pattern, giữ nguyên pattern hiện tại
      return;
    }

    const patternObj = COMMON_PATTERNS.find((p) => p.value === patternValue);
    if (patternObj) {
      handleValidationChange({ pattern: patternObj.pattern });
    }
  };

  const selectedFileType = config.validation?.file?.allowedMimeTypes || [];

  const toggleGroup = (group, options, checked) => {
    const optionValues = options.map((o) => o.value);
    let next;
    if (checked) {
      // add all group values
      next = [...new Set([...selectedFileType, ...optionValues])];
    } else {
      // remove all group values
      next = selectedFileType.filter((v) => !optionValues.includes(v));
    }
    handleValidationChange({
      file: { ...config.validation?.file, allowedMimeTypes: next },
    });
  };

  const toggleSingle = (value, checked) => {
    let next;
    if (checked) {
      next = [...selectedFileType, value];
    } else {
      next = selectedFileType.filter((v) => v !== value);
    }
    handleValidationChange({
      file: { ...config.validation?.file, allowedMimeTypes: next },
    });
  };

  const handleTypeClick = (event) => setTypeAnchorEl(event.currentTarget);
  const handleTypeClose = () => setTypeAnchorEl(null);

  const addVisibilityCondition = () => {
    const newCondition = {
      fieldKey: "",
      operator: "eq",
      value: "",
    };

    setConfig((prev) => ({
      ...prev,
      visibility: {
        ...prev.visibility,
        conditions: [...(prev.visibility?.conditions || []), newCondition],
      },
    }));
  };

  const updateVisibilityCondition = (index, updates) => {
    setConfig((prev) => {
      const newConditions = [...(prev.visibility?.conditions || [])];
      newConditions[index] = { ...newConditions[index], ...updates };

      return {
        ...prev,
        visibility: {
          ...prev.visibility,
          conditions: newConditions,
        },
      };
    });
  };

  const removeVisibilityCondition = (index) => {
    setConfig((prev) => {
      const newConditions = [...(prev.visibility?.conditions || [])];
      newConditions.splice(index, 1);

      return {
        ...prev,
        visibility: {
          ...prev.visibility,
          conditions: newConditions,
        },
      };
    });
  };

  // Tìm xem async option hiện tại có nằm trong danh sách định nghĩa sẵn không
  const findCurrentAsyncOption = () => {
    if (!config.ui?.asyncOptions) return "";

    const found = predefinedAsyncOptions.find(
      (opt) =>
        opt.endpoint === config.ui.asyncOptions.endpoint &&
        opt.method === config.ui.asyncOptions.method &&
        opt.dataPath === config.ui.asyncOptions.dataPath
    );

    return found ? found.id : "custom";
  };

  return (
    <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">Field Properties</h3>
        <div className="flex">
          <button
            onClick={() => {
              if (config.key && config.label) {
                onSave(config);
                onCancel(); // Chỉ close khi save thành công
              } else {
                // Hiển thị thông báo lỗi hoặc highlight các field bắt buộc
                console.log("Please fill in required fields");
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
        {/* Basic Settings */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            onClick={() => toggleSection("basic")}
          >
            <span>Basic Settings</span>
            {expandedSections.basic ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.basic && (
            <div className="space-y-4 pl-2 border-l-2 border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Key
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-600">
                  {config.key || "Auto-generated"}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={config.label}
                  onChange={(e) =>
                    handleConfigChange({ label: e.target.value })
                  }
                  placeholder="e.g., First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Field Type
                </label>
                <button
                  onClick={handleTypeClick}
                  className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-between"
                >
                  <span className="text-gray-900">
                    {fieldTypes.find((t) => t.value === config.type)?.label ||
                      "Select Type"}
                  </span>
                  <FaChevronDown className="h-4 w-4 text-gray-400" />
                </button>
                <Popover
                  open={Boolean(typeAnchorEl)}
                  anchorEl={typeAnchorEl}
                  onClose={handleTypeClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <div className="p-2 max-h-50 overflow-y-auto">
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

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                  <button
                    type="button"
                    onClick={() =>
                      handleConfigChange({
                        validation: {
                          ...config.validation,
                          required: !config.validation?.required,
                        },
                      })
                    }
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Help Text
                </label>
                <textarea
                  value={config.helpText || ""}
                  onChange={(e) =>
                    handleConfigChange({ helpText: e.target.value })
                  }
                  placeholder="Optional help text for users"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5e83ae] focus:border-[#5e83ae] text-sm resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* UI Settings */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            onClick={() => toggleSection("ui")}
          >
            <span>UI Settings</span>
            {expandedSections.ui ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.ui && (
            <div className="space-y-4 pl-2 border-l-2 border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Column Span (1-12)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={config.ui?.colSpan || 12}
                  onChange={(e) =>
                    handleUIConfigChange({ colSpan: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {config.type === "TEXTAREA" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rows
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={config.ui?.rows || 3}
                    onChange={(e) =>
                      handleUIConfigChange({ rows: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}

              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Component
                </label>
                <input
                  type="text"
                  value={config.ui?.component || ""}
                  onChange={(e) =>
                    handleUIConfigChange({ component: e.target.value })
                  }
                  placeholder="Custom component name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div> */}
            </div>
          )}
        </div>

        {/* Validation Settings */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            onClick={() => toggleSection("validation")}
          >
            <span>Validation Rules</span>
            {expandedSections.validation ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.validation && (
            <div className="space-y-4 pl-2 border-l-2 border-gray-200">
              {["TEXT", "TEXTAREA", "EMAIL", "PHONE"].includes(config.type) && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Length
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.validation?.minLength || ""}
                      onChange={(e) =>
                        handleValidationChange({
                          minLength: parseInt(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Length
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.validation?.maxLength || ""}
                      onChange={(e) =>
                        handleValidationChange({
                          maxLength: parseInt(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pattern
                    </label>
                    <select
                      value={selectedPattern}
                      onChange={(e) => handlePatternChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                    >
                      {COMMON_PATTERNS.map((pattern) => (
                        <option key={pattern.value} value={pattern.value}>
                          {pattern.label}
                        </option>
                      ))}
                    </select>

                    {selectedPattern === "" && (
                      <input
                        type="text"
                        value={config.validation?.pattern || ""}
                        onChange={(e) =>
                          handleValidationChange({ pattern: e.target.value })
                        }
                        placeholder="Nhập regex pattern tùy chỉnh"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    )}

                    {config.validation?.pattern && (
                      <p className="text-xs text-gray-500 mt-1">
                        Pattern: {config.validation.pattern}
                      </p>
                    )}
                  </div>
                </>
              )}

              {config.type === "NUMBER" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Value
                    </label>
                    <input
                      type="number"
                      value={config.validation?.min || ""}
                      onChange={(e) =>
                        handleValidationChange({
                          min: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Value
                    </label>
                    <input
                      type="number"
                      value={config.validation?.max || ""}
                      onChange={(e) =>
                        handleValidationChange({
                          max: parseFloat(e.target.value) || undefined,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </>
              )}

              {config.type === "FILE" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max File Size (KB)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.validation?.file?.maxSizeKB || ""}
                      onChange={(e) =>
                        handleValidationChange({
                          file: {
                            ...config.validation?.file,
                            maxSizeKB: parseInt(e.target.value) || undefined,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Files
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={config.validation?.file?.maxFiles || ""}
                      onChange={(e) =>
                        handleValidationChange({
                          file: {
                            ...config.validation?.file,
                            maxFiles: parseInt(e.target.value) || undefined,
                          },
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>

                  <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Allowed MIME Types
      </label>
<div className="block justify-between items-center mb-2 pl-4">
      {Object.entries(FILE_TYPE).map(([group, options]) => {
        const allChecked = options.every((opt) => selectedFileType.includes(opt.value));
        const someChecked = options.some((opt) => selectedFileType.includes(opt.value));

        return (
          
            
          <div key={group} className="pb-2">
            {/* Checkbox group */}
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-500">
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => {
                  if (el) el.indeterminate = !allChecked && someChecked;
                }}
                onChange={(e) => toggleGroup(group, options, e.target.checked)}
              />
              <span>{group}</span>
            </label>

            {/* Checkbox options */}
            <div className="ml-4 mt-1 grid grid-cols-2">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center space-x-2 text-sm text-gray-500"
                >
                  <input
                    type="checkbox"
                    checked={selectedFileType.includes(opt.value)}
                    onChange={(e) => toggleSingle(opt.value, e.target.checked)}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
      </div>
    </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Message
                </label>
                <input
                  type="text"
                  value={config.validation?.errorMessage || ""}
                  onChange={(e) =>
                    handleValidationChange({ errorMessage: e.target.value })
                  }
                  placeholder="Error message when validation fails"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Async Options */}
        {["SELECT", "RADIO", "CHECKBOX"].includes(config.type) && (
          <div>
            <button
              className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
              onClick={() => toggleSection("asyncOptions")}
            >
              <span>Dynamic Options</span>
              {expandedSections.asyncOptions ? (
                <FiChevronUp />
              ) : (
                <FiChevronDown />
              )}
            </button>

            {expandedSections.asyncOptions && (
              <div className="space-y-4 pl-2 border-l-2 border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data Source
                  </label>
                  <select
                    value={findCurrentAsyncOption()}
                    onChange={(e) => handleAsyncOptionsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">None (Use static options)</option>
                    {predefinedAsyncOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                    <option value="custom">Custom API (Advanced)</option>
                  </select>
                </div>

                {/* Chỉ hiển thị form nhập custom API nếu người dùng chọn "Custom API" */}
                {findCurrentAsyncOption() === "custom" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        API Endpoint
                      </label>
                      <input
                        type="text"
                        value={config.ui?.asyncOptions?.endpoint || ""}
                        onChange={(e) =>
                          handleAsyncOptionsChange({
                            ...config.ui?.asyncOptions,
                            endpoint: e.target.value,
                          })
                        }
                        placeholder="e.g., /api/options"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        HTTP Method
                      </label>
                      <select
                        value={config.ui?.asyncOptions?.method || "GET"}
                        onChange={(e) =>
                          handleAsyncOptionsChange({
                            ...config.ui?.asyncOptions,
                            method: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Path
                      </label>
                      <input
                        type="text"
                        value={config.ui?.asyncOptions?.dataPath || ""}
                        onChange={(e) =>
                          handleAsyncOptionsChange({
                            ...config.ui?.asyncOptions,
                            dataPath: e.target.value,
                          })
                        }
                        placeholder="e.g., data.items (for response: { data: { items: [...] } })"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        JSON path to extract options from API response
                      </p>
                    </div>
                  </>
                )}

                {/* Hiển thị thông tin về option đã chọn */}
                {findCurrentAsyncOption() &&
                  findCurrentAsyncOption() !== "custom" &&
                  findCurrentAsyncOption() !== "" && (
                    <div className="p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-blue-800">
                        This field will dynamically load options from the{" "}
                        <strong>
                          {
                            predefinedAsyncOptions.find(
                              (opt) => opt.id === findCurrentAsyncOption()
                            )?.name
                          }
                        </strong>{" "}
                        API.
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}

        {/* Options for dropdown/radio - Chỉ hiển thị nếu không dùng async options */}
        {["SELECT", "RADIO", "CHECKBOX"].includes(config.type) &&
          !config.ui?.asyncOptions && (
            <div>
              <button
                className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
                onClick={() => toggleSection("staticOptions")}
              >
                <span>Static Options</span>
                {expandedSections.staticOptions ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button>
              
              {expandedSections.staticOptions && (
                <div className="space-y-4 pl-2 border-l-2 border-gray-200">
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
                          const value = label
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, "_");
                          newOptions[index] = {
                            ...newOptions[index],
                            label,
                            value,
                          };
                          handleConfigChange({ options: newOptions });
                        }}
                        className="w-full pr-7 px-2 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => {
                          const newOptions = (config.options || []).filter(
                            (_, i) => i !== index
                          );
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
                      options: [
                        ...(config.options || []),
                        { value: "", label: "" },
                      ],
                    });
                  }}
                  className="flex items-center border rounded gap-1 px-2 py-1 text-sm text-[#5e83ae] hover:bg-gray-200"
                >
                  <MdAdd size={18} />
                  Thêm Option
                </button>
              </div>
              )}
            </div>
          )}

        {/* Visibility Conditions */}
        <div>
          <button
            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 mb-2"
            onClick={() => toggleSection("visibility")}
          >
            <span>Visibility Conditions</span>
            {expandedSections.visibility ? <FiChevronUp /> : <FiChevronDown />}
          </button>

          {expandedSections.visibility && (
            <div className="space-y-4 pl-2 border-l-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Logic</span>
                <select
                  value={config.visibility?.logic || "AND"}
                  onChange={(e) =>
                    handleConfigChange({
                      visibility: {
                        ...config.visibility,
                        logic: e.target.value,
                      },
                    })
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="AND">AND (Tất cả điều kiện phải đúng)</option>
                  <option value="OR">OR (Chỉ cần một điều kiện đúng)</option>
                </select>
              </div>

              <div className="space-y-3">
                {(config.visibility?.conditions || []).map(
                  (condition, index) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-100 rounded border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Điều kiện {index + 1}
                        </span>
                        <button
                          onClick={() => removeVisibilityCondition(index)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove condition"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Field Key
                          </label>
                          <select
                            value={condition.fieldKey || ""}
                            onChange={(e) =>
                              updateVisibilityCondition(index, {
                                fieldKey: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Chọn field</option>
                            {existingFields.map((field) => (
                              <option key={field.key} value={field.key}>
                                {field.key}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Operator
                          </label>
                          <select
                            value={condition.operator || "eq"}
                            onChange={(e) =>
                              updateVisibilityCondition(index, {
                                operator: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {OPERATORS_WITH_LABELS.map((op) => (
                              <option key={op.value} value={op.value}>
                                {op.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            value={condition.value || ""}
                            onChange={(e) =>
                              updateVisibilityCondition(index, {
                                value: e.target.value,
                              })
                            }
                            placeholder="Giá trị so sánh"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}

                <button
                  onClick={addVisibilityCondition}
                  className="flex items-center border rounded gap-1 px-2 py-1 text-sm text-[#5e83ae] hover:bg-gray-200"
                >
                  <MdAdd size={18} />
                  Thêm điều kiện
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FieldConfigPanel;
