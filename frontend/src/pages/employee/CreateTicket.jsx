import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, FileText, ChevronRight, Users, Search, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getFormTemplates, getFormTemplate } from '../../services/formTemplateService';
import { userService } from '../../services';
import { apiClient } from '../../services';
import { ticketService } from '../../services/ticketService';
import FieldComponents from '../../components/FormBuilder/FieldComponents';

export default function CreateTicket() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Early return if user not loaded yet
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user information...</p>
        </div>
      </div>
    );
  }
  
  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Template, 2: Fill Form & Workflow, 3: Review
  
  // Template selection
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({});
  const [workflowApprovers, setWorkflowApprovers] = useState({}); // { stepId: approverId }
  const [availableApprovers, setAvailableApprovers] = useState({}); // { departmentId: [approvers] }
  const [priorities, setPriorities] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load available form templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        setError(''); // Clear any previous errors
        
        console.log('🔄 Fetching templates...');
        const response = await getFormTemplates();
        console.log('✅ Templates response:', response);
        
        // Handle pagination response
        const templatesData = response.data?.content || response.data || [];
        console.log('📋 Parsed templates data:', templatesData);
        
        setTemplates(templatesData);
      } catch (err) {
        console.error('❌ Error loading templates:', err);
        setError(`Failed to load form templates: ${err.message || 'Unknown error'}`);
      } finally {
        setLoadingTemplates(false);
      }
    };

    if (user) {
      fetchTemplates();
    }
  }, [user]);

  // Load approvers when template is selected
  useEffect(() => {
    if (selectedTemplate?.approvalWorkflows) {
      loadApproversForWorkflow();
    }
  }, [selectedTemplate]);

  // Load priorities (use shared api client to avoid parse issues)
  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const { data } = await apiClient.get('/priorities');
        setPriorities(Array.isArray(data) ? data : []);
        console.log('✅ Priorities loaded:', data);
      } catch (error) {
        console.error('❌ Error loading priorities:', error);
        setPriorities([]);
      }
    };

    fetchPriorities();
  }, []);

  const loadApproversForWorkflow = async () => {
    try {
      console.log('🔄 Loading approvers for workflow...');
      const approversMap = {};
      
      // Get unique department IDs from workflow
      const departmentIds = [...new Set(selectedTemplate.approvalWorkflows.map(w => w.departmentId))];
      console.log('🏢 Department IDs:', departmentIds);
      
      // Fetch approvers for each department
      for (const deptId of departmentIds) {
        try {
          const response = await userService.getApproversByDepartment(deptId);
          approversMap[deptId] = response.data || [];
          console.log(`✅ Approvers for dept ${deptId}:`, response.data);
        } catch (deptErr) {
          console.warn(`⚠️ Failed to load approvers for dept ${deptId}:`, deptErr);
          approversMap[deptId] = []; // Set empty array for this department
        }
      }
      
      setAvailableApprovers(approversMap);
      console.log('📋 All approvers loaded:', approversMap);
    } catch (err) {
      console.error('❌ Error loading approvers:', err);
      setError('Failed to load approvers');
    }
  };

  const handleTemplateSelect = async (template) => {
    try {
      setError('');
      // Load full template details
      const fullTemplate = await getFormTemplate(template.id);
      setSelectedTemplate(fullTemplate);
      // Reset workflow approvers when switching template to avoid stale/null keys
      setWorkflowApprovers({});
      
      // Initialize form data with default values
      const initialFormData = {};
      if (fullTemplate.formSchema?.fields) {
        fullTemplate.formSchema.fields.forEach(field => {
          if (field.defaultValue !== undefined) {
            initialFormData[field.key] = field.defaultValue;
          }
        });
      }
      setFormData(initialFormData);
      
      // Move to next step
      setCurrentStep(2);
    } catch (err) {
      console.error('Error loading template:', err);
      setError('Failed to load template details');
    }
  };

  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const handleApproverSelect = (workflowStepId, approverId) => {
    setWorkflowApprovers(prev => ({
      ...prev,
      [workflowStepId]: String(approverId)
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      // Confirm before creating ticket
      const confirmed = window.confirm('Create this ticket with the selected details?');
      if (!confirmed) {
        setIsSubmitting(false);
        return;
      }

      // Validate priority selection
      if (!selectedPriority) {
        setError('Please select a priority level');
        return;
      }

      // Validate required form fields
      if (selectedTemplate.formSchema?.fields) {
        const requiredFields = selectedTemplate.formSchema.fields.filter(
          field => field.validation?.required
        );
        
        const missingFields = requiredFields.filter(
          field => !formData[field.key] || formData[field.key] === ''
        );
        
        if (missingFields.length > 0) {
          setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
          return;
        }
      }

      // Validate workflow approvers (only if workflow steps exist)
      const workflowSteps = selectedTemplate.approvalWorkflows || [];
      for (const step of workflowSteps) {
        if (!workflowApprovers[step.id] || workflowApprovers[step.id] === '') {
          setError(`Please select an approver for workflow step: ${step.stepName}`);
          return;
        }
      }

      // Build workflowApprovers strictly from template steps to avoid null/undefined keys
      const filteredWorkflowApprovers = {};
      (selectedTemplate.approvalWorkflows || []).forEach((step) => {
        const key = step.id ?? step.stepOrder; // fallback to stepOrder if id missing
        const approverId = workflowApprovers[key] ?? workflowApprovers[step.id] ?? workflowApprovers[step.stepOrder];
        if (approverId && approverId !== '') {
          filteredWorkflowApprovers[String(key)] = String(approverId);
        }
      });

      // Log final selection for debugging
      console.log('Final workflowApprovers payload:', filteredWorkflowApprovers);

      // Prepare ticket data for backend
      const ticketData = {
        templateId: selectedTemplate.id,
        requesterId: user.id,
        title: selectedTemplate.name,
        description: selectedTemplate.description,
        formData: formData,
        workflowApprovers: filteredWorkflowApprovers,
        priorityId: selectedPriority ? Number(selectedPriority) : null
      };

      console.log('🚀 Submitting ticket to backend:', ticketData);
      
      // Call backend API
      const createdTicket = await ticketService.createTicketFromTemplate(ticketData);
      
      console.log('✅ Ticket created successfully:', createdTicket);
      // Notify success
      window.alert('Ticket created successfully!');
      // Redirect to dashboard after creation
      navigate('/employee/home');
      
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError('Failed to create ticket. Please try again.');
      window.alert('Failed to create ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter templates based on search term
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.createdBy?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render form fields based on template schema
  const renderFormFields = () => {
    if (!selectedTemplate?.formSchema?.fields) return null;

    return selectedTemplate.formSchema.fields.map(field => {
      const FieldComponent = FieldComponents[field.type] || FieldComponents.TEXT;
      
      return (
        <div key={field.key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <FieldComponent
            field={field}
            value={formData[field.key]}
            onChange={(value) => handleFieldChange(field.key, value)}
            disabled={false}
          />
          
          {field.helpText && (
            <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
          )}
        </div>
      );
    });
  };

  // Render workflow approver selection
  const renderWorkflowSelection = () => {
    if (!selectedTemplate?.approvalWorkflows?.length) return null;

    return (
      <div className="space-y-6">
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Select Approvers for Workflow
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Choose specific approvers for each step in the approval process.
          </p>
        </div>

        {selectedTemplate.approvalWorkflows.map((step, index) => {
          const departmentApprovers = availableApprovers[step.departmentId] || [];
          
          return (
            <div key={step.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3">
                  {step.stepOrder}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{step.stepName}</h4>
                  <p className="text-sm text-gray-500">
                    Department: {step.departmentName || `Dept ${step.departmentId}`}
                  </p>
                </div>
              </div>
              
              <div className="ml-9">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Approver <span className="text-red-500">*</span>
                </label>
                <select
                  value={workflowApprovers[step.id] || ''}
                  onChange={(e) => handleApproverSelect(step.id, String(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose approver...</option>
                  <option value="any">Any approver in this department</option>
                  {departmentApprovers.map(approver => (
                    <option key={approver.id} value={approver.id}>
                      {approver.fullName} ({approver.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else {
              navigate('/employee/home');
            }
          }}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {currentStep > 1 ? 'Back' : 'Back to Dashboard'}
        </button>
        
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
            <p className="text-gray-600">
              {currentStep === 1 && 'Choose a form template for your request'}
              {currentStep === 2 && 'Fill out the form and select approvers'}
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Select Template</span>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Fill Form</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Step 1: Template Selection */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header with Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Available Form Templates</h2>
              <div className="text-sm text-gray-500">
                {loadingTemplates ? 'Loading...' : `${filteredTemplates.length} template(s) found`}
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates by name, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {/* Templates List */}
          <div className="max-h-96 overflow-y-auto">
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-500">Loading templates...</span>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>
                  {searchTerm ? `No templates found matching "${searchTerm}"` : 'No form templates available'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-blue-600 hover:text-blue-800 underline"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
                            {template.description && (
                              <p className="text-sm text-gray-600 truncate">{template.description}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 ml-11">
                          <span className="flex items-center">
                            👤 {template.createdBy?.fullName || 'Admin'}
                          </span>
                          <span className="flex items-center">
                            📅 {new Date(template.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                          {template.approvalWorkflows?.length > 0 && (
                            <span className="flex items-center">
                              🔄 {template.approvalWorkflows.length} step(s)
                            </span>
                          )}
                          {template.formSchema?.fields?.length > 0 && (
                            <span className="flex items-center">
                              📝 {template.formSchema.fields.length} field(s)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // TODO: Add preview functionality
                            console.log('Preview template:', template.id);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Preview template"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Fill Form & Select Approvers */}
      {currentStep === 2 && selectedTemplate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h2>
            {selectedTemplate.description && (
              <p className="text-gray-600 mt-1">{selectedTemplate.description}</p>
            )}
          </div>

          {/* Priority Selection */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-4">Ticket Priority</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select priority...</option>
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.id}>
                    {priority.name} - {priority.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Fields */}
          <div className="mb-8">
            <h3 className="text-md font-medium text-gray-900 mb-4">Form Details</h3>
            {renderFormFields()}
          </div>

          {/* Workflow Selection */}
          {renderWorkflowSelection()}

          {/* Submit buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Creating Ticket...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Create Ticket</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
