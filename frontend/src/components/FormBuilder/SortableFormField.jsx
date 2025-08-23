import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FieldComponents from "./FieldComponents";
import { FiMove, FiEdit, FiTrash2 } from "react-icons/fi";

const SortableFormField = ({field, index, onEdit, onRemove, onFieldChange, formData, disabled}) => {
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field?.key || `field-${index}` });

  // Kiểm tra nếu field không tồn tại
  if (!field) {
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    gridColumn: `span ${field.ui?.colSpan || 12}`,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
  };

  // Lấy component phù hợp với field type, mặc định là TEXT
  const FieldComponent = FieldComponents[field.type] || FieldComponents.TEXT;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative transition-all ${
        disabled 
          ? 'p-0' 
          : 'p-4 bg-white border border-gray-300 rounded-lg'
      } ${isDragging ? "shadow-lg" : disabled ? "" : "hover:shadow-md"}`}
    >
      {!disabled && (
        <div className="flex justify-between items-center mb-3">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium capitalize">
            {field.type.toLowerCase()}
          </span>
          <div className="flex items-center gap-1">
            <button
              {...attributes}
              {...listeners}
              className="p-1 text-gray-500 hover:text-gray-700 cursor-grab active:cursor-grabbing"
              title="Drag to reorder"
            >
              <FiMove size={14} />
            </button>
            <button
              className="p-1 text-green-500 hover:text-green-700"
              onClick={() => {
                console.log('Edit button clicked for index:', index);
                onEdit(index);
              }}
              title="Edit field"
            >
              <FiEdit size={14} />
            </button>
            <button
              className="p-1 text-red-500 hover:text-red-700"
              onClick={() => onRemove(index)}
              title="Remove field"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      )}

      <div>
        <label className={`block font-semibold text-gray-700 ${disabled ? 'text-sm mb-1' : 'mb-2'}`}>
          {field.label}
          {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <FieldComponent
          field={field}
          value={formData && formData[field.key] !== undefined ? formData[field.key] : ""}
          onChange={(value) => onFieldChange(field.key, value)}
          disabled={disabled}
          placeholder={field.helpText}
        />
      </div>
    </div>
  );
};

export default SortableFormField;