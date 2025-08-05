import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  progress = 0, 
  className = "",
  showPercentage = true,
  label = ""
}) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-primary-600">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className="progress-bar h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;