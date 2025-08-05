import React from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  type = "input", 
  label, 
  value, 
  onChange, 
  error, 
  placeholder,
  options = [],
  ...props 
}) => {
const handleChange = (e) => {
    if (typeof onChange === 'function') {
      // Handle both event objects (from Input/Textarea) and direct values (from Select)
      const value = e && e.target ? e.target.value : e;
      onChange(value);
    }
  };

  if (type === "textarea") {
    return (
      <Textarea
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  if (type === "select") {
    return (
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        error={error}
        placeholder={placeholder}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  }

  return (
    <Input
      type={type}
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default FormField;