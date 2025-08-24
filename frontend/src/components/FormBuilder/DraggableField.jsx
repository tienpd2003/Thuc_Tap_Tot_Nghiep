const DraggableField = ({ type, label, icon, onAddField }) => {
  return (
    <div
      className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      onClick={() => onAddField(type)}
    >
      <div className="text-[#5e83ae] mr-2">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};

export default DraggableField;
