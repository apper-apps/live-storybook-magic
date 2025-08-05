import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApiKeyInput from '@/components/molecules/ApiKeyInput';
import ApperIcon from '@/components/ApperIcon';
import { settingsService } from '@/services/api/settingsService';
import { toast } from 'react-toastify';

function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const currentSettings = settingsService.getSettings();
    setSettings(currentSettings);
    setHasChanges(false);
  };

  const handleApiKeyChange = (provider, value) => {
    if (!settings) return;
    
    const newSettings = {
      ...settings,
      apiKeys: {
        ...settings.apiKeys,
        [provider]: value
      }
    };
    setSettings(newSettings);
    setHasChanges(true);
  };

  const handleSaveSettings = async () => {
    if (!settings || !hasChanges) return;

    setSaving(true);
    try {
      const success = settingsService.saveSettings(settings);
      if (success) {
        toast.success('Settings saved successfully!');
        setHasChanges(false);
      } else {
        toast.error('Failed to save settings. Please try again.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleClearApiKeys = () => {
    if (!settings) return;

    const confirmed = window.confirm(
      'Are you sure you want to clear all API keys? This action cannot be undone.'
    );

    if (confirmed) {
      const success = settingsService.clearApiKeys();
      if (success) {
        loadSettings();
        toast.success('All API keys cleared successfully!');
      } else {
        toast.error('Failed to clear API keys. Please try again.');
      }
    }
  };

  const validateApiKey = (provider, key) => {
    return settingsService.validateApiKey(provider, key);
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display gradient-text mb-4">
            Settings
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Configure your API keys and preferences for generating magical stories
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <ApperIcon name="Key" className="w-6 h-6 text-primary-500" />
              <h2 className="text-2xl font-display gradient-text">
                API Keys
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <ApperIcon name="AlertTriangle" className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">
                      Security Notice
                    </h3>
                    <p className="text-sm text-yellow-700">
                      API keys are stored securely in your browser's local storage. 
                      They are never sent to our servers and remain private to your device.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <ApperIcon name="Brain" className="w-5 h-5" />
                    OpenAI GPT-4o
                  </h3>
                  <ApiKeyInput
                    provider="openai"
                    value={settings.apiKeys.openai}
                    onChange={handleApiKeyChange}
                    placeholder="sk-..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">OpenAI Platform</a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <ApperIcon name="Zap" className="w-5 h-5" />
                    Anthropic Claude Sonnet
                  </h3>
                  <ApiKeyInput
                    provider="anthropic"
                    value={settings.apiKeys.anthropic}
                    onChange={handleApiKeyChange}
                    placeholder="sk-ant-..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Get your API key from <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Anthropic Console</a>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <ApperIcon name="Sparkles" className="w-5 h-5" />
                    Google Gemini 1.5
                  </h3>
                  <ApiKeyInput
                    provider="google"
                    value={settings.apiKeys.google}
                    onChange={handleApiKeyChange}
                    placeholder="AIza..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Google AI Studio</a>
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Button
                  onClick={handleSaveSettings}
                  disabled={!hasChanges || saving}
                  variant="primary"
                  className="flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleClearApiKeys}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4" />
                  Clear All Keys
                </Button>
              </div>

              {hasChanges && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Info" className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-blue-700">
                      You have unsaved changes. Click "Save Settings" to persist your API keys.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default SettingsPage;