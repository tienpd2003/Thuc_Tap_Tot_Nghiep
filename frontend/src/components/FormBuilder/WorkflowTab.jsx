import React from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiMove, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";


const SortableWorkflowStep = ({ step, index, onEdit, onRemove, departments }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id || `step-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    willChange: isDragging ? 'transform' : 'auto',
  };

  const department = departments.find(d => d.id === step.departmentId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white border border-gray-300 rounded-lg relative transition-all ${isDragging ? "shadow-lg" : "hover:shadow-md"
        }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          Step {step.stepOrder}
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
            onClick={() => onEdit(index)}
            title="Edit step"
          >
            <FiEdit size={14} />
          </button>
          <button
            className="p-1 text-red-500 hover:text-red-700"
            onClick={() => onRemove(index)}
            title="Remove step"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <label className="block text-sm font-semibold text-gray-700">Step Name: </label>
          <div className="text-sm text-gray-900">{step.stepName}</div>
        </div>
        <div className="flex gap-2">
          <label className="block text-sm font-semibold text-gray-700">Approval Department:</label>
          <div className="text-sm text-gray-900">{department?.name || 'Unknown Department'}</div>
        </div>
      </div>
    </div>
  );
};


const WorkflowTab = ({ workflowSteps, setWorkflowSteps, departments, onEditStep }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 150,
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
      const oldIndex = workflowSteps.findIndex(step => (step.id || `step-${workflowSteps.indexOf(step)}`) === active.id);
      const newIndex = workflowSteps.findIndex(step => (step.id || `step-${workflowSteps.indexOf(step)}`) === over.id);

      const newSteps = arrayMove(workflowSteps, oldIndex, newIndex);
      // Cập nhật stepOrder cho tất cả steps
      const updatedSteps = newSteps.map((step, index) => ({
        ...step,
        stepOrder: index + 1
      }));
      setWorkflowSteps(updatedSteps);
    }
  };

  const addStep = () => {
    const newStep = {
      id: `step-${Date.now()}`,
      stepOrder: workflowSteps.length + 1,
      departmentId: '',
      stepName: ''
    };
    setWorkflowSteps([...workflowSteps, newStep]);
    onEditStep(workflowSteps.length);
  };

  const editStep = (index) => {
    onEditStep(index);
  };

  const removeStep = (index) => {
    const newSteps = workflowSteps.filter((_, i) => i !== index);
    // Cập nhật stepOrder cho các steps còn lại
    const updatedSteps = newSteps.map((step, i) => ({
      ...step,
      stepOrder: i + 1
    }));
    setWorkflowSteps(updatedSteps);
  };

  return (
    <div className="flex flex-1 px-4 pb-4 flex flex-col min-h-0">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold">Workflow Steps<span className="text-red-500 ml-1">*</span></h3>
        <button
          className="cursor-pointer px-3 py-2 rounded-lg bg-[#1976d2] hover:bg-[#4a6b8a] text-white justify-center flex gap-1"
          onClick={addStep}
        >
          <FiPlus size={20} />
          Add Workflow Step
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={workflowSteps.map(step => step.id || `step-${workflowSteps.indexOf(step)}`)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 mt-4 p-4 overflow-y-auto border-2 border-dashed border-gray-300 rounded-xl transition-all min-h-[120px] w-full">

            {workflowSteps.length === 0 ? (
              <div className="flex flex-1 justify-center items-center text-gray-500 italic text-center">
                Click "Add Workflow Step" to create approval workflow
              </div>
            ) : (
              workflowSteps.map((step, index) => (
                <SortableWorkflowStep
                  key={step.id || `step-${index}`}
                  step={step}
                  index={index}
                  onEdit={editStep}
                  onRemove={removeStep}
                  departments={departments}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default WorkflowTab;
