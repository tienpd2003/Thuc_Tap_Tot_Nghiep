import { useState, useCallback } from 'react';

export const useFormBuilder = (initialSchema = { fields: [], layout: {} }) => {
  const [formSchema, setFormSchema] = useState(initialSchema);
  const [formData, setFormData] = useState({});

  const addField = useCallback((fieldType, index) => {
    const newField = {
      key: `${fieldType}_${Date.now()}`,
      label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
      type: fieldType,
      validation: {},
      ui: { colSpan: 12 },
      order: formSchema.fields.length
    };
    
    const newFields = [...formSchema.fields];
    newFields.splice(index, 0, newField);
    
    setFormSchema(prev => ({...prev, fields: newFields}));
    return newFields.length - 1;
  }, [formSchema.fields]);

  const updateField = useCallback((index, fieldConfig) => {
    const newFields = [...formSchema.fields];
    newFields[index] = { ...newFields[index], ...fieldConfig };
    setFormSchema(prev => ({...prev, fields: newFields}));
  }, [formSchema.fields]);

  const removeField = useCallback((index) => {
    const newFields = formSchema.fields.filter((_, i) => i !== index);
    setFormSchema(prev => ({...prev, fields: newFields}));
  }, [formSchema.fields]);

  const updateFormData = useCallback((fieldKey, value) => {
    setFormData(prev => ({...prev, [fieldKey]: value}));
  }, []);

  const moveField = useCallback((fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    
    const newFields = [...formSchema.fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    
    // Update order property
    newFields.forEach((field, index) => {
      field.order = index;
    });
    
    setFormSchema(prev => ({...prev, fields: newFields}));
  }, [formSchema.fields]);

  return {
    formSchema,
    formData,
    setFormSchema,
    addField,
    updateField,
    removeField,
    updateFormData,
    moveField
  };
};