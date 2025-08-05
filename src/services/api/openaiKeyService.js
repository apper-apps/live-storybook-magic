import { toast } from 'react-toastify';

// OpenAI Key Service - Manages API key storage and retrieval using ApperClient
class OpenaiKeyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'openai_key';
  }

  // Get all API keys for the current user
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "user_id" } },
          { field: { Name: "key_name" } },
          { field: { Name: "key_value" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "CreatedOn", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching API keys:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  // Get API key by provider name
  async getByProvider(provider) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "key_name" } },
          { field: { Name: "key_value" } }
        ],
        where: [
          {
            FieldName: "key_name",
            Operator: "EqualTo",
            Values: [provider],
            Include: true
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const keys = response.data || [];
      return keys.length > 0 ? keys[0] : null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching API key for ${provider}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Create or update API key for a provider
  async saveApiKey(provider, keyValue, userId) {
    try {
      // First check if key already exists for this provider
      const existingKey = await this.getByProvider(provider);
      
      if (existingKey) {
        // Update existing key
        return await this.update(existingKey.Id, {
          key_value: keyValue
        });
      } else {
        // Create new key
        return await this.create({
          Name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} API Key`,
          user_id: userId,
          key_name: provider,
          key_value: keyValue
        });
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error saving API key:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Create a new API key record (only includes updateable fields)
  async create(keyData) {
    try {
      const params = {
        records: [
          {
            // Only include updateable fields based on field visibility
            Name: keyData.Name,
            Tags: keyData.Tags || '',
            user_id: keyData.user_id,
            key_name: keyData.key_name,
            key_value: keyData.key_value
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} API key records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('API key saved successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating API key:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Update an existing API key (only includes updateable fields)
  async update(keyId, updateData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(keyId),
            // Only include updateable fields based on field visibility
            ...(updateData.Name !== undefined && { Name: updateData.Name }),
            ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
            ...(updateData.user_id !== undefined && { user_id: updateData.user_id }),
            ...(updateData.key_name !== undefined && { key_name: updateData.key_name }),
            ...(updateData.key_value !== undefined && { key_value: updateData.key_value })
          }
        ]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} API key records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('API key updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating API key:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Delete an API key
  async delete(keyId) {
    try {
      const params = {
        RecordIds: [parseInt(keyId)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} API key records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('API key deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting API key:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  // Get API key value for a specific provider
  async getApiKeyValue(provider) {
    try {
      const keyRecord = await this.getByProvider(provider);
      return keyRecord ? keyRecord.key_value : '';
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error getting API key value for ${provider}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return '';
    }
  }
}

export const openaiKeyService = new OpenaiKeyService();