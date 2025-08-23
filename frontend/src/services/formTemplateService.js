import apiClient from './apiClient';

export const getAllFormTemplates = async (filters = {}) => {
  const response = await apiClient.get("/form-templates", { params: filters });
  return response.data;
};

export const getFormTemplate = async (formTemplateId) => {
  const response = await apiClient.get(`/form-templates/${formTemplateId}`);
  return response.data.formSchema;
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