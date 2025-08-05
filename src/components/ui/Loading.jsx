import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading your magical stories..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center"
      >
        <ApperIcon name="BookOpen" className="w-8 h-8 text-white" />
      </motion.div>

      <div className="text-center space-y-2">
        <h3 className="font-display text-xl font-bold gradient-text">
          {message}
        </h3>
        <div className="flex justify-center">
          <div className="loading-dots text-primary-500">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      {/* Loading skeleton for story cards */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="shimmer h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="shimmer h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="shimmer h-3 bg-gray-200 rounded w-full"></div>
                <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex justify-between pt-4">
                  <div className="shimmer h-8 bg-gray-200 rounded w-20"></div>
                  <div className="shimmer h-8 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;