import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md",
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center font-semibold rounded-full";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    warning: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white",
    error: "bg-gradient-to-r from-red-500 to-red-600 text-white",
    outline: "border-2 border-primary-500 text-primary-500 bg-transparent"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;