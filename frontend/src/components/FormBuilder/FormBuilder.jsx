import React, { useState, useEffect } from 'react';
import FormCanvas from './FormCanvas';
import WorkflowTab from './WorkflowTab';
import WorkflowConfigPanel from './WorkflowConfigPanel';
import Toolbox from './Toolbox';
import FieldConfigPanel from './FieldConfigPanel';
import { MdPreview, MdCheckCircle, MdSave, MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { apiClient, departmentService } from '../../services';

// Main Form Builder Component
const FormBuilder = ({ templateId }) => {
  const navigate = useNavigate();

  const [formSchema, setFormSchema] = useState({
    fields: [],
    layout: { type: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '16px' }
  });
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [activeTab, setActiveTab] = useState('fields'); // 'fields' or 'workflow'
  const [editingFieldIndex, setEditingFieldIndex] = useState(null);
  const [editingStepIndex, setEditingStepIndex] = useState(null);

  // Debug editingFieldIndex changes
  useEffect(() => {
    console.log('editingFieldIndex changed to:', editingFieldIndex);
  }, [editingFieldIndex]);
  const [formData, setFormData] = useState({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(templateId || '');
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // Load departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAllDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error('Failed to load departments:', error);
        // Fallback data for testing
        setDepartments([
          { id: 1, name: 'IT Department' },
          { id: 2, name: 'HR Department' },
          { id: 3, name: 'Finance Department' },
          { id: 4, name: 'Marketing Department' }
        ]);
      }
    };

    fetchDepartments();
  }, []);

  // Load form templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await apiClient.get('/form-templates');
        setTemplates(response.data);
      } catch (error) {
        console.error('Failed to load form templates:', error);
      }
    };

    fetchTemplates();
  }, []);

  // Load form schema when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      loadFormSchema(selectedTemplate);
    }
  }, [selectedTemplate]);

  const loadFormSchema = async (templateId) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/form-templates/${templateId}`);
      console.log('Received data from backend:', response.data);
      
      // Transform backend response to frontend format
      const backendFormSchema = response.data.formSchema;
      const transformedFormSchema = {
        fields: (backendFormSchema?.fields || []).map(field => ({
          key: field.key,
          label: field.label,
          type: field.type,
          helpText: field.helpText || field.placeholder,
          validation: field.validation || {},
          ui: field.ui || { colSpan: 12 },
          options: (field.options || []).map(option => ({
            value: option.value,
            label: option.label,
            disabled: option.disabled || false
          })),
          readOnly: field.readOnly || false,
          defaultValue: field.defaultValue,
          order: field.order || 0,
          visibility: field.visibility,
          repeatConfig: field.repeatConfig,
          subFields: field.subFields || [],
          meta: field.meta || {}
        })),
        layout: backendFormSchema?.layout || { 
          type: 'grid', 
          gridTemplateColumns: 'repeat(12, 1fr)', 
          gap: '16px' 
        }
      };

      // Transform workflow steps
      const transformedWorkflowSteps = (response.data.approvalWorkflows || []).map(workflow => ({
        id: workflow.id,
        stepOrder: workflow.stepOrder,
        departmentId: workflow.departmentId,
        stepName: workflow.stepName
      }));

      console.log('Transformed form schema:', transformedFormSchema);
      console.log('Transformed workflow steps:', transformedWorkflowSteps);

      setFormSchema(transformedFormSchema);
      setWorkflowSteps(transformedWorkflowSteps);
      setTemplateName(response.data.name);
      setTemplateDescription(response.data.description);
      setFormData({});
    } catch (error) {
      console.error('Failed to load form schema:', error);
      alert('Failed to load form schema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveForm = async () => {
    setIsLoading(true);
    try {
      // Transform formSchema to match backend structure
      const transformedFormSchema = {
        version: 1,
        fields: formSchema.fields.map(field => ({
          key: field.key,
          label: field.label,
          type: field.type,
          placeholder: field.helpText, // Using helpText as placeholder
          helpText: field.helpText,
          order: field.order || 0,
          readOnly: field.readOnly || false,
          defaultValue: field.defaultValue,
          options: (field.options || []).map(option => ({
            value: option.value,
            label: option.label,
            disabled: option.disabled || false,
            meta: option.meta || {}
          })),
          ui: {
            colSpan: field.ui?.colSpan || 12,
            width: field.ui?.width,
            component: field.ui?.component,
            rows: field.ui?.rows
          },
          validation: {
            required: field.validation?.required || false,
            minLength: field.validation?.minLength,
            maxLength: field.validation?.maxLength,
            pattern: field.validation?.pattern,
            min: field.validation?.min,
            max: field.validation?.max,
            minDate: field.validation?.minDate,
            maxDate: field.validation?.maxDate,
            precision: field.validation?.precision,
            unique: field.validation?.unique,
            errorMessage: field.validation?.errorMessage
          },
          visibility: field.visibility,
          repeatConfig: field.repeatConfig,
          subFields: field.subFields || [],
          meta: field.meta || {}
        })),
        layout: formSchema.layout,
        permissions: {},
        meta: {}
      };

      // Transform workflowSteps to match backend structure
      const transformedWorkflows = workflowSteps.map(step => ({
        stepOrder: step.stepOrder,
        departmentId: step.departmentId,
        stepName: step.stepName
      }));

      const formDataToSave = {
        name: templateName || `Form Template ${Date.now()}`,
        description: templateDescription || 'Form created from frontend',
        isActive: true,
        createdById: 1, // This should be the actual user ID
        formSchema: transformedFormSchema,
        approvalWorkflows: transformedWorkflows
      };

      console.log('Sending data to backend:', formDataToSave);

      if (selectedTemplate) {
        // Update existing template
        await apiClient.put(`/form-templates/${selectedTemplate}`, formDataToSave);
      } else {
        // Create new template
        const response = await apiClient.post('/form-templates', formDataToSave);
        setSelectedTemplate(response.data.id);
        setTemplates([...templates, response.data]);
      }

      alert('Form schema saved successfully!');
    } catch (error) {
      console.error('Failed to save form schema:', error);
      alert('Failed to save form schema');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async () => {
    try {
      await apiClient.post(`/form-templates/${selectedTemplate}/responses`, {
        formData: formData,
        submittedBy: 1 // This should be the actual user ID
      });
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Failed to submit form:', error);
      alert('Failed to submit form');
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    setFormData({ ...formData, [fieldKey]: value });
  };

  const addFieldFromToolbox = (type) => {
    const newField = {
      key: `${Date.now()}`,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type,
      validation: {},
      ui: { colSpan: 12 }
    };

    // Thêm field mới vào array và set editing index
    const newFields = [...formSchema.fields, newField];
    setFormSchema({
      ...formSchema,
      fields: newFields
    });
    
    // Set editing index cho field mới vừa tạo
    setEditingFieldIndex(newFields.length - 1);
  };

  const handleEditStep = (index) => {
    setEditingStepIndex(index);
  };

  const handleSaveStep = (stepConfig) => {
    if (editingStepIndex !== null) {
      const newSteps = [...workflowSteps];
      newSteps[editingStepIndex] = { ...stepConfig, id: workflowSteps[editingStepIndex].id };
      setWorkflowSteps(newSteps);
    }
    setEditingStepIndex(null);
  };

  const handleCancelStepEdit = () => {
    setEditingStepIndex(null);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white rounded-xl shadow-sm pt-4 max-h-full">

      <div className="flex justify-between items-center pb-4 px-4 shadow-xs border-b border-gray-300 flex-shrink-0">
        {/* Left section: Close button and title */}
        <div className="flex items-center gap-4">
          <button className="cursor-pointer px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-3xl">
            <MdClose onClick={() => navigate(-1)} className="h-5 w-5" />
          </button>
          <div className="flex flex-col border-l border-gray-300 pl-4">
            <h2 className="text-xl font-semibold">Form Builder</h2>
            <span className="text-xs text-gray-500">Add and customize forms for your needs</span>
          </div>
        </div>

        {/* Center section: Tabs */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'fields'
                ? 'bg-[#5e83ae] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fields
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'workflow'
                ? 'bg-[#5e83ae] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Workflow
          </button>
        </div>

        {/* Right section: Preview and Save buttons */}
        <div className="flex gap-2">
          {/* Preview / Exit Preview */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isPreviewMode
                ? "border-red-500 text-red-500 hover:bg-red-50"
                : "border-[#5e83ae] text-[#5e83ae] hover:bg-gray-100"
            }`}
          >
            {isPreviewMode ? <MdClose size={18} /> : <MdPreview size={18} />}
            {isPreviewMode ? "Exit Preview" : "Preview"}
          </button>

          {/* Save / Submit */}
          {isPreviewMode ? (
            <button
              onClick={handleSubmitForm}
              className="flex items-center gap-2 border border-green-600 text-green-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              <MdCheckCircle size={18} />
              Submit Form
            </button>
          ) : (
            <button
              onClick={handleSaveForm}
              className="flex items-center gap-2 border border-[#5e83ae] text-[#5e83ae] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              <MdSave size={18} />
              Save
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 min-h-0">

        <div className="flex flex-1 min-h-0 flex-col">  
          {isPreviewMode ? (
            // Preview mode: show both fields and workflow
            <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              {/* Template Info in Preview */}
              <div className="p-4 border-gray-200">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="templateName" className="mb-1 font-semibold">
                      Template Name<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="templateName"
                      type="text"
                      placeholder="Template Name"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      disabled={isPreviewMode}
                      className="px-3 py-2 border border-gray-300 rounded min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[#5e83ae]"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <label htmlFor="templateDescription" className="mb-1 font-semibold">
                      Template Description<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      id="templateDescription"
                      type="text"
                      placeholder="Template Description"
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      disabled={isPreviewMode}
                      className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5e83ae]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields Preview */}
              <div className="flex-1 pt-4">
                <h3 className="pl-4 text-md font-semibold">Form Fields</h3>
                <FormCanvas
                  formSchema={formSchema}
                  setFormSchema={setFormSchema}
                  isPreviewMode={true}
                  onEditField={setEditingFieldIndex}
                  formData={formData}
                  onFieldChange={handleFieldChange}
                  addFieldFromToolbox={addFieldFromToolbox}
                />
              </div>
              
              {/* Workflow Preview */}
              {workflowSteps.length > 0 && (
                <div className="flex-1 p-4 border-gray-200">
                  <h3 className="text-md font-semibold mb-4">Approval Workflow</h3>
                  <div className="grid gap-4">
                    {workflowSteps.map((step, index) => {
                      const department = departments.find(d => d.id === step.departmentId);
                      return (
                        <div key={step.id || index} className="p-4 bg-white border border-gray-300 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              Step {step.stepOrder}
                            </span>
                            <span className="text-sm font-medium text-gray-900">{step.stepName}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Department: {department?.name || 'Unknown Department'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Edit mode: show template info and active tab
            <>
              <div className="flex gap-4 p-4">
                <div className="flex flex-col">
                  <label htmlFor="templateName" className="mb-1 font-semibold">
                    Tên Form<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="templateName"
                    type="text"
                    placeholder="Nhập tên form"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    disabled={isPreviewMode}
                    className="px-3 py-2 border border-gray-300 rounded min-w-[200px] focus:outline-none focus:ring-2 focus:ring-[#5e83ae]"
                  />
                </div>

                <div className="flex flex-col flex-1">
                  <label htmlFor="templateDescription" className="mb-1 font-semibold">
                    Mô tả<span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    id="templateDescription"
                    type="text"
                    placeholder="Mô tả mục đích, đối tượng, các trường hợp sử dụng form"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    disabled={isPreviewMode}
                    className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#5e83ae]"
                  />
                </div>
              </div>

              {activeTab === 'fields' ? (
                <FormCanvas
                  formSchema={formSchema}
                  setFormSchema={setFormSchema}
                  isPreviewMode={false}
                  onEditField={setEditingFieldIndex}
                  formData={formData}
                  onFieldChange={handleFieldChange}
                  addFieldFromToolbox={addFieldFromToolbox}
                />
              ) : (
                <WorkflowTab
                  workflowSteps={workflowSteps}
                  setWorkflowSteps={setWorkflowSteps}
                  departments={departments}
                  onEditStep={handleEditStep}
                />
              )}
            </>
          )}
        </div>

        {/* Right panel for editing */}
        {!isPreviewMode && (
          activeTab === 'fields' ? (
            editingFieldIndex !== null ? (
              <FieldConfigPanel
                field={formSchema.fields[editingFieldIndex]}
                onSave={(fieldConfig) => {
                  console.log('FieldConfigPanel onSave called with:', fieldConfig);
                  const newFields = [...formSchema.fields];
                  // Đảm bảo field có key và label trước khi save
                  if (fieldConfig.key && fieldConfig.label) {
                    newFields[editingFieldIndex] = fieldConfig;
                    setFormSchema({ ...formSchema, fields: newFields });
                    console.log('Field saved successfully:', fieldConfig);
                  } else {
                    console.log('Field missing required fields (key or label)');
                  }
                }}
                onCancel={() => {
                  console.log('FieldConfigPanel onCancel called');
                  setEditingFieldIndex(null);
                }}
                existingFields={formSchema.fields}
              />
            ) : (
              <Toolbox onAddField={addFieldFromToolbox} />
            )
          ) : (
            // Workflow tab
            editingStepIndex !== null ? (
              <WorkflowConfigPanel
                step={workflowSteps[editingStepIndex]}
                onSave={handleSaveStep}
                onCancel={handleCancelStepEdit}
                departments={departments}
              />
            ) : (
              <div className="w-80 bg-gray-50 p-4 border-l border-gray-200 h-full overflow-y-auto">
                <h3 className="font-semibold text-gray-800 mb-4">Workflow Tools</h3>
                <p className="text-sm text-gray-600">
                  Click on a workflow step to edit its properties, or use the "Add Workflow Step" button to create new steps.
                </p>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
};

export default FormBuilder;