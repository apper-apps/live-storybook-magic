import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden";
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        hover && "card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;