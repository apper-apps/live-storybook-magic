import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ApiKeyInput = ({ 
  provider, 
  value, 
  onChange, 
  onValidate,
  isValidating = false,
  isValid = null,
  error = ""
}) => {
  const [showKey, setShowKey] = useState(false);

  const getProviderInfo = () => {
    switch (provider) {
      case "openai":
        return {
          name: "OpenAI",
          placeholder: "sk-...",
          helpText: "Get your API key from platform.openai.com"
        };
      case "anthropic":
        return {
          name: "Anthropic",
          placeholder: "sk-ant-...",
          helpText: "Get your API key from console.anthropic.com"
        };
      case "google":
        return {
          name: "Google Gemini",
          placeholder: "AI...",
          helpText: "Get your API key from ai.google.dev"
        };
      default:
        return {
          name: "API Key",
          placeholder: "Enter your API key",
          helpText: "Please enter a valid API key"
        };
    }
  };

  const providerInfo = getProviderInfo();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-700">
          {providerInfo.name} API Key
        </label>
        
        <div className="flex items-center space-x-2">
          {isValid === true && (
            <div className="flex items-center text-green-600">
              <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
              <span className="text-xs">Valid</span>
            </div>
          )}
          
          {isValid === false && (
            <div className="flex items-center text-red-600">
              <ApperIcon name="XCircle" className="w-4 h-4 mr-1" />
              <span className="text-xs">Invalid</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <FormField
          type={showKey ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={providerInfo.placeholder}
          error={error}
          className="pr-20"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1">
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon 
              name={showKey ? "EyeOff" : "Eye"} 
              className="w-4 h-4" 
            />
          </button>
          
          {value && onValidate && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onValidate(provider, value)}
              disabled={isValidating}
              className="p-1 h-auto"
            >
              {isValidating ? (
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : (
                <ApperIcon name="CheckCircle" className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500">
        {providerInfo.helpText}
      </p>

      <AnimatePresence>
        {provider === "openai" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="security-warning rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <ApperIcon name="Shield" className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-1">
                  Security Notice
                </p>
                <p className="text-yellow-700">
                  Your API key is stored securely and never shared. Do not include keys in prompts or share them publicly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiKeyInput;