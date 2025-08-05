import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  error,
  label,
  placeholder,
  ...props 
}, ref) => {
  const baseStyles = "form-input w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-0 transition-all duration-300";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          baseStyles,
          error && "border-red-500 focus:border-red-500",
          className
        )}
        placeholder={placeholder}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;