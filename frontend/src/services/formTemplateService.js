import apiClient from './apiClient';

export const getAllFormTemplates = async (filters = {}) => {
  const response = await apiClient.get("/form-templates", { params: filters });
  return response.data;
};

export const getFormTemplates = async (page = 0, size = 10) => {
  const response = await apiClient.get("/form-templates", { 
    params: { page, size } 
  });
  return response;
};

export const getFormTemplate = async (formTemplateId) => {
  const response = await apiClient.get(`/form-templates/${formTemplateId}`);
  return response.data; // Return full template data, not just formSchema
};

// Save form schema
export const saveFormSchema = async (formData) => {
  if (formData.formTemplateId) {
    // Update existing template
    const response = await apiClient.put(
      `/form-templates/${formData.formTemplateId}`,
      formData
    );
    return response.data;
  } else {
    // Create new template
    const response = await apiClient.post(
      `/form-templates`,
      formData
    );
    return response.data;
  }
};

// Submit form response
export const submitFormResponse = async (formTemplateId, responseData) => {
  const response = await apiClient.post(
    `/form-templates/${formTemplateId}/responses`,
    responseData
  );
  return response.data;
};

export const activateFormTemplate = async (formTemplateId) => {
  const response = await apiClient.patch(
    `/form-templates/${formTemplateId}/activate`
  );
  return response.data;
}

export const deactivateFormTemplate = async (formTemplateId) => {
  const response = await apiClient.patch(
    `/form-templates/${formTemplateId}/deactivate`
  );
  return response.data;
}

export const deleteFormTemplate = async (formTemplateId) => {
  const response = await apiClient.delete(
    `/form-templates/${formTemplateId}`
  );
  return response.data;
}

// Default export for compatibility
export default {
  getAllFormTemplates,
  getFormTemplates,
  getFormTemplate,
  saveFormSchema,
  submitFormResponse,
  activateFormTemplate, 
  deactivateFormTemplate, 
  deleteFormTemplate
};