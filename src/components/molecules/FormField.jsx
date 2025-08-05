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
    onChange(e.target.value);
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