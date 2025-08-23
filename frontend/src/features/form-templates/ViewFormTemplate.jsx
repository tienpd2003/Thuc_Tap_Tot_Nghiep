import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FieldComponents from "../../components/FormBuilder/FieldComponents";
import { getFormTemplate } from "../../services/formTemplateService";

export default function ViewFormTemplate() {
  const { id } = useParams(); // Lấy ID từ URL params
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Fetch form template với ID từ URL
  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const result = await getFormTemplate(id);
        setTemplate(result);
        setError(null);
        
        // Khởi tạo formData với giá trị mặc định từ template
        const initialFormData = {};
        if (result.formSchema?.fields) {
          result.formSchema.fields.forEach(field => {
            if (field.defaultValue !== undefined) {
              initialFormData[field.key] = field.defaultValue;
            }
          });
        }
        setFormData(initialFormData);
      } catch (err) {
        console.error('Failed to fetch template:', err);
        setError('Failed to load form template. Please make sure the server is running and the template exists.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTemplate();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra các trường bắt buộc
      const requiredFields = template.formSchema.fields.filter(
        field => field.validation?.required
      );
      
      const missingFields = requiredFields.filter(
        field => !formData[field.key] || formData[field.key] === ''
      );
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }
      
      await axios.post(`http://localhost:8080/api/form-templates/${id}/responses`, {
        formData,
        submittedBy: 1 // Nên lấy từ authentication context/state
      });
      
      setSubmitted(true);
      setError(null);
    } catch (err) {
      console.error('Failed to submit form:', err);
      setError('Failed to submit form. Please try again.');
    }
  };

  // Handle field changes
  const handleFieldChange = (fieldKey, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Render form fields dựa trên schema
  const renderFormFields = () => {
    if (!template?.formSchema?.fields) return null;

    return template.formSchema.fields.map(field => {
      const FieldComponent = FieldComponents[field.type] || FieldComponents.TEXT;
      
      return (
        <div key={field.key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
            <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
          )}
        </div>
      );
    });
  };

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

  if (error && !submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 mb-4">
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-green-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <h2 className="text-xl font-bold mt-2">Form Submitted Successfully!</h2>
            <p className="mt-2">Thank you for submitting the form.</p>
          </div>
          <button 
            onClick={() => setSubmitted(false)} 
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mt-4"
          >
            Fill Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{template?.name || 'Form Template'}</h1>
          {template?.description && (
            <p className="text-gray-600 mt-2">{template.description}</p>
          )}
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderFormFields()}
          
          <div className="mt-6">
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}