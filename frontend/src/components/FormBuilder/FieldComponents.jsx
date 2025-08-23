import React from "react";
import {
  TextField,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  InputAdornment,
} from "@mui/material";
import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCalendarDay,
  FaPaperclip,
} from "react-icons/fa";

const FieldComponents = {
  TEXT: ({ field, value, onChange, disabled, placeholder }) => (
    <TextField
      fullWidth
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled || field.readOnly}
      size="small"
    />
  ),

  NUMBER: ({ field, value, onChange, disabled, placeholder }) => (
    <TextField
      fullWidth
      type="number"
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled || field.readOnly}
      size="small"
    />
  ),

  DATE: ({ field, value, onChange, disabled }) => (
    <TextField
      fullWidth
      type="date"
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || field.readOnly}
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaCalendarAlt />
          </InputAdornment>
        ),
      }}
    />
  ),

  DATETIME: ({ field, value, onChange, disabled }) => (
    <TextField
      fullWidth
      type="datetime-local"
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || field.readOnly}
      size="small"
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaCalendarDay />
          </InputAdornment>
        ),
      }}
    />
  ),

  FILE: ({ field, onChange, disabled }) => (
    <TextField
      fullWidth
      type="file"
      variant="outlined"
      onChange={(e) => onChange(e.target.files[0])}
      disabled={disabled || field.readOnly}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaPaperclip />
          </InputAdornment>
        ),
      }}
    />
  ),

  SELECT: ({ field, value, onChange, disabled }) => (
    <TextField
      fullWidth
      select
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || field.readOnly}
      size="small"
    >
      <MenuItem value="">
        <em>Select an option</em>
      </MenuItem>
      {(field.options || []).map((option, index) => (
        <MenuItem
          key={option.value || index}
          value={option.value || ""}
          disabled={option.disabled}
        >
          {option.label || option.value || `Option ${index + 1}`}
        </MenuItem>
      ))}
    </TextField>
  ),

  TEXTAREA: ({ field, value, onChange, disabled, placeholder }) => (
    <TextField
      fullWidth
      multiline
      rows={field.ui?.rows || 4}
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled || field.readOnly}
      size="small"
    />
  ),

  CHECKBOX: ({ field, value, onChange, disabled }) => {
    if (field.options && field.options.length > 0) {
      return (
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">{field.label}</FormLabel>
          <FormGroup>
            {field.options.map((option) => {
              const isSelected = Array.isArray(value)
                ? value.includes(option.value)
                : false;
              return (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => {
                        const newValue = e.target.checked
                          ? [...(Array.isArray(value) ? value : []), option.value]
                          : Array.isArray(value)
                          ? value.filter((v) => v !== option.value)
                          : [];
                        onChange(newValue);
                      }}
                      disabled={disabled || field.readOnly || option.disabled}
                    />
                  }
                  label={option.label}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      );
    } else {
      return (
        <FormControlLabel
          control={
            <Checkbox
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
              disabled={disabled || field.readOnly}
            />
          }
          label={field.label}
        />
      );
    }
  },

  RADIO: ({ field, value, onChange, disabled }) => (
    <FormControl component="fieldset" fullWidth>
      <RadioGroup
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {(field.options || []).map((option, index) => (
          <FormControlLabel
            key={option.value || index}
            value={option.value}
            control={
              <Radio
                disabled={disabled || field.readOnly || option.disabled}
                sx={{
                  '&.Mui-checked': {
                    color: '#5e83ae',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(94, 131, 174, 0.04)',
                  },
                }}
              />
            }
            label={option.label || option.value || `Option ${index + 1}`}
          />
        ))}
      </RadioGroup>
    </FormControl>
  ),

  EMAIL: ({ field, value, onChange, disabled, placeholder }) => (
    <TextField
      fullWidth
      type="email"
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled || field.readOnly}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaEnvelope />
          </InputAdornment>
        ),
      }}
    />
  ),

  PHONE: ({ field, value, onChange, disabled, placeholder }) => (
    <TextField
      fullWidth
      type="tel"
      variant="outlined"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled || field.readOnly}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaPhone />
          </InputAdornment>
        ),
      }}
    />
  ),
};

export default FieldComponents;