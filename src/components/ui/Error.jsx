import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong while loading your stories.", 
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md mx-auto text-center p-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="font-display text-xl font-bold text-gray-900">
            Oops! Something went wrong
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>

          {showRetry && onRetry && (
            <div className="pt-4">
              <Button
                onClick={onRetry}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="RefreshCw" className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              If the problem persists, please check your internet connection and try again.
            </p>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

export default Error;