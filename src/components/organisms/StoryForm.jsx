import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApiKeyInput from "@/components/molecules/ApiKeyInput";
import ApperIcon from "@/components/ApperIcon";
import { enhancePrompt } from "@/utils/transformers";
import { toast } from "react-toastify";
import { settingsService } from "@/services/api/settingsService";

const StoryForm = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState({
    prompt: "",
    enhancedPrompt: "",
    characterCount: 800,
    illustrationCount: 10,
    llmProvider: "",
    illustrationStyle: "cartoon"
  });

const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    google: ""
  });

  const [validationStatus, setValidationStatus] = useState({});
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanced, setShowEnhanced] = useState(false);
// Load API keys from settings on component mount
  useEffect(() => {
    const settings = settingsService.getSettings();
    setApiKeys(settings.apiKeys);
  }, []);
  const llmOptions = [
    { value: "openai", label: "OpenAI GPT-4o" },
    { value: "anthropic", label: "Anthropic Claude Sonnet" },
    { value: "google", label: "Google Gemini 1.5" }
  ];

const styleOptions = [
    { value: "watercolor", label: "Watercolor" },
    { value: "sketch", label: "Sketch" },
    { value: "digital", label: "Digital Art" }
  ];

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

const handleApiKeyChange = (provider, key) => {
    setApiKeys(prev => ({ ...prev, [provider]: key }));
    // Save to persistent storage
    settingsService.saveApiKey(provider, key);
    // Reset validation status when key changes
    setValidationStatus(prev => ({ ...prev, [provider]: null }));
  };

  const handleEnhancePrompt = async () => {
    if (!formData.prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(formData.prompt);
      setFormData(prev => ({ ...prev, enhancedPrompt: enhanced }));
      setShowEnhanced(true);
      toast.success("Prompt enhanced successfully!");
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast.error("Failed to enhance prompt");
    } finally {
      setIsEnhancing(false);
    }
  };

const validateForm = () => {
    const finalPrompt = showEnhanced && formData.enhancedPrompt ? formData.enhancedPrompt : formData.prompt;
    
    if (!finalPrompt.trim()) {
      toast.error("Please enter a story prompt");
      return false;
    }

    if (!formData.llmProvider) {
      toast.error("Please select an LLM provider");
      return false;
    }

    // Allow story generation without API keys in development/mock environment
    // This enables users to test the application without configuring API keys
    return true;
  };

const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const finalPrompt = showEnhanced && formData.enhancedPrompt ? formData.enhancedPrompt : formData.prompt;
    
    const submissionData = {
      ...formData,
      prompt: finalPrompt,
      apiKey: apiKeys[formData.llmProvider] || null, // Allow null API key for mock generation
      useMockGeneration: !apiKeys[formData.llmProvider] // Flag to indicate mock generation should be used
    };

    onSubmit(submissionData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold gradient-text mb-4">
            Create Your Magical Story
          </h2>
          <p className="text-gray-600 text-lg">
            Tell us what kind of story you'd like to create, and we'll bring it to life with beautiful illustrations!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Story Prompt Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="PenTool" className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900">
                Story Idea
              </h3>
            </div>

            <FormField
              type="textarea"
              label="What story would you like to create?"
              value={formData.prompt}
              onChange={(value) => handleFieldChange("prompt", value)}
              placeholder="e.g., A brave bunny who discovers a magical forest filled with friendly creatures"
              rows={4}
            />

            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !formData.prompt.trim()}
                className="flex items-center space-x-2"
              >
                {isEnhancing ? (
                  <>
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span>Enhancing...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Sparkles" className="w-4 h-4" />
                    <span>Suggest Improvements</span>
                  </>
                )}
              </Button>
            </div>

            {/* Enhanced Prompt */}
            {showEnhanced && formData.enhancedPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-primary-800 flex items-center">
                    <ApperIcon name="Sparkles" className="w-4 h-4 mr-2" />
                    Enhanced Prompt
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEnhanced(false)}
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
                
                <FormField
                  type="textarea"
                  value={formData.enhancedPrompt}
                  onChange={(value) => handleFieldChange("enhancedPrompt", value)}
                  rows={3}
                  className="bg-white"
                />
                
                <p className="text-sm text-primary-700 mt-2">
                  You can edit this enhanced version or use your original prompt.
                </p>
              </motion.div>
            )}
          </div>

          {/* Story Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 md:col-span-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Settings" className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900">
                Story Settings
              </h3>
            </div>

            <FormField
              type="number"
              label="Character Count"
              value={formData.characterCount}
              onChange={(value) => handleFieldChange("characterCount", parseInt(value) || 800)}
              min={500}
              max={1500}
              step={100}
            />

            <FormField
              type="number"
              label="Number of Illustrations"
              value={formData.illustrationCount}
              onChange={(value) => handleFieldChange("illustrationCount", parseInt(value) || 10)}
              min={5}
              max={15}
              step={1}
            />

<FormField
              type="select"
              label="Illustration Style"
              value={formData.illustrationStyle}
              onChange={(value) => handleFieldChange("illustrationStyle", value)}
              options={styleOptions}
              showPreviews={true}
            />
          </div>

          {/* LLM Selection */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <ApperIcon name="Brain" className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900">
                AI Configuration
              </h3>
            </div>

            <FormField
              type="select"
              label="Choose AI Model"
              value={formData.llmProvider}
              onChange={(value) => handleFieldChange("llmProvider", value)}
              placeholder="Select an AI model"
              options={llmOptions}
            />

            {/* API Key Input */}
            {formData.llmProvider && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
<ApiKeyInput
                  provider={formData.llmProvider}
                  value={apiKeys[formData.llmProvider]}
                  onChange={(value) => handleApiKeyChange(formData.llmProvider, value)}
                  isValid={validationStatus[formData.llmProvider]}
                />
                {!apiKeys[formData.llmProvider] && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <div className="flex items-center gap-2">
                      <ApperIcon name="Info" className="w-4 h-4 text-blue-600" />
                      <p className="text-sm text-blue-700">
                        No API key configured. <a href="/settings" className="font-medium text-primary-500 hover:underline">Go to Settings</a> to add your API keys.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="px-12 py-4 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-3">
                  <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>Creating Your Story...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Wand2" className="w-5 h-5" />
                  <span>Generate Story</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default StoryForm;