// Utility functions cho date formatting
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Format numbers với thousand separator
export const formatNumber = (number) => {
  if (typeof number !== 'number') return '0';
  return number.toLocaleString('vi-VN');
};

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number') return '0%';
  return `${value.toFixed(decimals)}%`;
};

// Truncate text với ellipsis
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalizeFirst = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Check if string is valid email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check if string is valid phone number (Vietnamese format)
export const isValidPhone = (phone) => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  return phoneRegex.test(phone);
};

// Generate random ID (for temporary usage)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
