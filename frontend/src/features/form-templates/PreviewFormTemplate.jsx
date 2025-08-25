import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Edit, Settings } from "lucide-react";
import { getFormTemplate } from "../../services/formTemplateService";
import FieldComponents from "../../components/FormBuilder/FieldComponents";

export default function PreviewFormTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'workflow' | 'details'

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching template with ID:', id);
        
        const result = await getFormTemplate(id);
        console.log('✅ Template fetched successfully:', result);
        
        setTemplate(result);
        setError(null);
      } catch (err) {
        console.error('❌ Failed to fetch template:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        let errorMessage = 'Failed to load form template.';
        if (err.response?.status === 404) {
          errorMessage = `Template with ID ${id} not found.`;
        } else if (err.response?.status === 400) {
          errorMessage = `Invalid template ID: ${id}`;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id]);

  const renderFormFields = () => {
    if (!template?.formSchema?.fields) return null;

    return template.formSchema.fields.map(field => {
      const FieldComponent = FieldComponents[field.type] || FieldComponents.TEXT;
      
      return (
        <div key={field.key} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {field.label}
            {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          
          <FieldComponent
            field={field}
            value={field.defaultValue || ''}
            onChange={() => {}} // No-op for preview
            disabled={true} // Always disabled in preview
            className="bg-gray-50" // Gray background to indicate disabled
          />
          
          {field.helpText && (
            <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
          )}
        </div>
      );
    });
  };

  const renderWorkflowSteps = () => {
    if (!template?.approvalWorkflows || template.approvalWorkflows.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Settings className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No approval workflow configured</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {template.approvalWorkflows.map((workflow, index) => (
          <div key={workflow.id || index} className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {workflow.stepOrder || index + 1}
            </div>
            <div className="ml-4 flex-1">
              <h4 className="text-sm font-medium text-gray-900">{workflow.stepName}</h4>
              <p className="text-sm text-gray-500">
                Department ID: {workflow.departmentId || 'Not specified'}
              </p>
            </div>
            {index < template.approvalWorkflows.length - 1 && (
              <div className="ml-4 text-gray-400">→</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderTemplateDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{template?.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Description</dt>
              <dd className="text-sm text-gray-900">{template?.description || 'No description'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Status</dt>
              <dd>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  template?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {template?.isActive ? 'Active' : 'Inactive'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Due in (days)</dt>
              <dd className="text-sm text-gray-900">
                {template?.dueInDays ? `${template.dueInDays} days` : 'Not set'}
              </dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Timestamps</h4>
          <dl className="space-y-2">
            <div>
              <dt className="text-xs font-medium text-gray-500">Created By</dt>
              <dd className="text-sm text-gray-900">{template?.createdByName || 'Unknown'}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Created At</dt>
              <dd className="text-sm text-gray-900">
                {template?.createdAt ? new Date(template.createdAt).toLocaleString() : 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-gray-500">Updated At</dt>
              <dd className="text-sm text-gray-900">
                {template?.updatedAt ? new Date(template.updatedAt).toLocaleString() : 'Unknown'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-2">Form Schema Info</h4>
        <dl className="space-y-2">
          <div>
            <dt className="text-xs font-medium text-gray-500">Total Fields</dt>
            <dd className="text-sm text-gray-900">
              {template?.formSchema?.fields?.length || 0} fields
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-gray-500">Required Fields</dt>
            <dd className="text-sm text-gray-900">
              {template?.formSchema?.fields?.filter(f => f.validation?.required).length || 0} required
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => navigate('/admin/form-templates')} 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/form-templates')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Templates
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {template?.name || 'Form Template'}
                </h1>
                <p className="text-sm text-gray-500">Preview Mode</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/admin/form-templates/${id}`)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Template
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Eye className="h-4 w-4 inline mr-2" />
                Form Preview
              </button>
              <button
                onClick={() => setActiveTab('workflow')}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'workflow'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Approval Workflow
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Template Details
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              {activeTab === 'preview' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Form Preview</h2>
                  <div className="space-y-6">
                    {renderFormFields()}
                  </div>
                  {(!template?.formSchema?.fields || template.formSchema.fields.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      <Eye className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No form fields configured</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'workflow' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Approval Workflow</h2>
                  {renderWorkflowSteps()}
                </div>
              )}

              {activeTab === 'details' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Template Details</h2>
                  {renderTemplateDetails()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
