import { closestCenter, DndContext, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import SortableFormField from "./SortableFormField";
import { MdAdd } from "react-icons/md";
import { useEffect, useRef } from "react";

const FormCanvas = ({ formSchema, setFormSchema, isPreviewMode, onEditField, formData, onFieldChange, addFieldFromToolbox }) => {

  const endRef = useRef(null);

  useEffect(() => {
    // Mỗi lần fields thay đổi thì scroll xuống cuối
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [formSchema.fields.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = formSchema.fields.findIndex(field => field.key === active.id);
      const newIndex = formSchema.fields.findIndex(field => field.key === over.id);

      const newFields = arrayMove(formSchema.fields, oldIndex, newIndex);
      setFormSchema({ ...formSchema, fields: newFields });
    }
  };

  // removed unused addField helper

  const removeField = (index) => {
    const newFields = formSchema.fields.filter((_, i) => i !== index);
    setFormSchema({ ...formSchema, fields: newFields });
  };

  return (
    <div className="flex flex-1 px-4 pb-4 flex-col min-h-0">



      {!isPreviewMode && (

        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold">Form Fields<span className="text-red-500 ml-1">*</span></h3>
          <button
            className="cursor-pointer px-3 py-2 rounded-lg bg-[#1976d2] hover:bg-[#4a6b8a] text-white justify-center flex gap-1"
            onClick={() => addFieldFromToolbox('TEXT')}
          >
            <MdAdd size={20} />
            Add Custom Field
          </button>
        </div>
      )}


      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={formSchema.fields.map(field => field.key)}
          strategy={rectSortingStrategy}
        >
          <div
            className={`grid gap-4 mt-4 overflow-y-auto transition-all min-h-[120px] w-full ${isPreviewMode
                ? 'gap-6'
                : 'px-4 pt-4 border-2 border-dashed border-gray-300 rounded-xl'
              }`}
            style={{
              ...formSchema.layout,
              ...(isPreviewMode && {
                gridTemplateColumns: 'repeat(12, 1fr)',
                gap: '24px'
              })
            }}
          >
            {formSchema.fields.length === 0 ? (
              <div className="flex flex-1 justify-center items-center text-gray-500 italic text-center col-span-full">Click on fields in the toolbox to add them to your form
                {isPreviewMode ? 'No fields in this form' : 'Click on fields in the toolbox to add them to your form'}
              </div>
            ) : (
              formSchema.fields.map((field, index) => (
                <SortableFormField
                  key={field.key}
                  id={field.key}
                  field={field}
                  index={index}
                  onEdit={isPreviewMode ? undefined : onEditField}
                  onRemove={isPreviewMode ? undefined : removeField}
                  onFieldChange={onFieldChange}
                  formData={formData}
                  disabled={isPreviewMode}
                />
              ))
            )}
            <div ref={endRef} className=""/>
          </div>
        </SortableContext>
      </DndContext>


    </div>
  );
};

export default FormCanvas;