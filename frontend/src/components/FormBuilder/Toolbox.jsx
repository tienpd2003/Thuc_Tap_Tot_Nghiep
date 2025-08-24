import React from "react";
import DraggableField from "./DraggableField";
import {
  FaFont, 
  FaHashtag,
  FaCalendarAlt,
  FaCalendarDay,
  FaFileUpload,
  FaChevronDown,
  FaAlignLeft,
  FaCheckSquare,
  FaDotCircle,
  FaEnvelope,
  FaPhone
} from "react-icons/fa";

const Toolbox = ({ onAddField }) => {
  const fieldTypes = [
    { type: "TEXT", label: "Text Input", icon: <FaFont /> },
    { type: "NUMBER", label: "Number Input", icon: <FaHashtag /> },
    { type: "DATE", label: "Date Picker", icon: <FaCalendarAlt /> },
    { type: "DATETIME", label: "DateTime Picker", icon: <FaCalendarDay /> },
    { type: "FILE", label: "File Upload", icon: <FaFileUpload /> },
    { type: "SELECT", label: "Dropdown", icon: <FaChevronDown /> },
    { type: "TEXTAREA", label: "Text Area", icon: <FaAlignLeft /> },
    { type: "CHECKBOX", label: "Checkbox", icon: <FaCheckSquare /> },
    { type: "RADIO", label: "Radio Group", icon: <FaDotCircle /> },
    // { type: "EMAIL", label: "Email Input", icon: <FaEnvelope /> },
    // { type: "PHONE", label: "Phone Input", icon: <FaPhone /> }
  ];

  return (
    <div className="w-80 p-4 border-l border-gray-200 h-full overflow-y-auto">
      <h3 className="font-semibold text-gray-800 mb-4">Elements</h3>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableField
            key={field.type}
            type={field.type}
            label={field.label}
            icon={field.icon}
            onAddField={onAddField}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbox;