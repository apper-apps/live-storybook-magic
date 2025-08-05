import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No stories yet!", 
  message = "Start creating your first magical children's book and watch your imagination come to life.",
  actionText = "Create Your First Story",
  actionPath = "/create"
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-lg mx-auto text-center p-12">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.1 
          }}
          className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <ApperIcon name="BookOpen" className="w-10 h-10 text-primary-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <h3 className="font-display text-2xl font-bold gradient-text mb-3">
              {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {message}
            </p>
          </div>

          <div className="pt-4">
            <Button
              size="lg"
              onClick={() => navigate(actionPath)}
              className="flex items-center space-x-3"
            >
              <ApperIcon name="Wand2" className="w-5 h-5" />
              <span>{actionText}</span>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-4">
              What you can create:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-center space-x-2 text-gray-600">
                <ApperIcon name="PenTool" className="w-4 h-4 text-primary-500" />
                <span>AI-written stories</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ApperIcon name="Image" className="w-4 h-4 text-primary-500" />
                <span>Custom illustrations</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <ApperIcon name="Download" className="w-4 h-4 text-primary-500" />
                <span>PDF downloads</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

export default Empty;