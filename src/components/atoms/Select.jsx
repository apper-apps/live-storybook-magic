import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  className, 
  error,
  label,
  placeholder,
  children,
  options,
  value,
  onChange,
  showPreviews,
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);

  const baseStyles = "form-input w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-primary-500 focus:ring-0 transition-all duration-300 appearance-none cursor-pointer";

  // Style preview configurations
  const stylePreviewData = {
    watercolor: {
      name: "Watercolor",
      description: "Soft, flowing colors with artistic transparency",
      gradient: "from-blue-200 via-purple-200 to-pink-200",
      icon: "Droplets"
    },
    sketch: {
      name: "Sketch",
      description: "Hand-drawn pencil strokes and artistic lines",
      gradient: "from-gray-200 via-gray-300 to-gray-400",
      icon: "PenTool"
    },
    digital: {
      name: "Digital Art",
      description: "Clean, vibrant digital illustrations",
      gradient: "from-cyan-200 via-blue-200 to-indigo-200",
      icon: "Monitor"
    }
  };

  // If showPreviews is enabled and options are provided, render custom dropdown
  if (showPreviews && options) {
    const selectedOption = options.find(opt => opt.value === value);
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            className={cn(
              baseStyles,
              error && "border-red-500 focus:border-red-500",
              "flex items-center justify-between",
              className
            )}
            onClick={() => setIsOpen(!isOpen)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          >
            <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
              {selectedOption ? selectedOption.label : placeholder || "Select an option"}
            </span>
            <ApperIcon 
              name="ChevronDown" 
              className={cn(
                "w-5 h-5 text-gray-400 transition-transform duration-200",
                isOpen && "rotate-180"
              )} 
            />
          </button>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {options.map((option) => {
                const previewData = stylePreviewData[option.value];
                return (
                  <div
                    key={option.value}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-all duration-200 flex items-center justify-between group",
                      "hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50",
                      value === option.value && "bg-primary-50 text-primary-700"
                    )}
                    onClick={() => {
                      onChange?.(option.value);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHoveredOption(option.value)}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <div className="flex items-center space-x-3">
                      {previewData && (
                        <div className={cn(
                          "w-8 h-8 rounded-lg bg-gradient-to-br transition-all duration-200",
                          previewData.gradient,
                          "flex items-center justify-center group-hover:scale-110"
                        )}>
                          <ApperIcon 
                            name={previewData.icon} 
                            className="w-4 h-4 text-gray-600" 
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">
                          {option.label}
                        </div>
                        {previewData && hoveredOption === option.value && (
                          <div className="text-xs text-gray-500 mt-1">
                            {previewData.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {value === option.value && (
                      <ApperIcon name="Check" className="w-4 h-4 text-primary-600" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Preview Card for Hovered Option */}
          {hoveredOption && stylePreviewData[hoveredOption] && (
            <div className="absolute z-60 left-full top-0 ml-4 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={cn(
                  "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
                  stylePreviewData[hoveredOption].gradient
                )}>
                  <ApperIcon 
                    name={stylePreviewData[hoveredOption].icon} 
                    className="w-6 h-6 text-gray-700" 
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {stylePreviewData[hoveredOption].name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {stylePreviewData[hoveredOption].description}
                  </p>
                </div>
              </div>
              
              {/* Style Preview Visual */}
              <div className={cn(
                "h-20 rounded-lg bg-gradient-to-br relative overflow-hidden",
                stylePreviewData[hoveredOption].gradient
              )}>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <ApperIcon 
                      name="Image" 
                      className="w-8 h-8 text-gray-600 mx-auto mb-1 opacity-80" 
                    />
                    <p className="text-xs text-gray-600 font-medium">Preview Style</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  // Default select behavior for non-preview usage
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            baseStyles,
            error && "border-red-500 focus:border-red-500",
            className
          )}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children || (options && options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ApperIcon name="ChevronDown" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;