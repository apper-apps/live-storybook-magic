// Settings Service - Manages persistent application settings
class SettingsService {
  constructor() {
    this.storageKey = 'storybook-settings';
    this.defaultSettings = {
      apiKeys: {
        openai: '',
        anthropic: '',
        google: ''
      },
      preferences: {
        defaultLlmProvider: 'openai',
        defaultStyle: 'watercolor'
      }
    };
  }

  // Get all settings from localStorage
  getSettings() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...this.defaultSettings, ...parsed };
      }
    } catch (error) {
      console.warn('Error loading settings from localStorage:', error);
    }
    return { ...this.defaultSettings };
  }

  // Save settings to localStorage
  saveSettings(settings) {
    try {
      const currentSettings = this.getSettings();
      const newSettings = { ...currentSettings, ...settings };
      localStorage.setItem(this.storageKey, JSON.stringify(newSettings));
      return true;
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
      return false;
    }
  }

  // Get API key for specific provider
  getApiKey(provider) {
    const settings = this.getSettings();
    return settings.apiKeys[provider] || '';
  }

  // Save API key for specific provider
  saveApiKey(provider, key) {
    const settings = this.getSettings();
    settings.apiKeys[provider] = key;
    return this.saveSettings(settings);
  }

  // Clear all API keys
  clearApiKeys() {
    const settings = this.getSettings();
    settings.apiKeys = { ...this.defaultSettings.apiKeys };
    return this.saveSettings(settings);
  }

  // Validate API key format (basic validation)
  validateApiKey(provider, key) {
    if (!key || key.trim().length === 0) {
      return { isValid: false, error: 'API key is required' };
    }

    const patterns = {
      openai: /^sk-[A-Za-z0-9]{48}$/,
      anthropic: /^sk-ant-[A-Za-z0-9-]{95}$/,
      google: /^[A-Za-z0-9_-]{39}$/
    };

    const pattern = patterns[provider];
    if (pattern && !pattern.test(key)) {
      return { 
        isValid: false, 
        error: `Invalid ${provider.charAt(0).toUpperCase() + provider.slice(1)} API key format` 
      };
    }

    return { isValid: true, error: null };
  }
}

export const settingsService = new SettingsService();