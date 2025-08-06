import { toast } from "react-toastify";
import React from "react";

// Stories Service - Manages story creation, retrieval, and management operations using ApperClient
class StoriesService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'story';
  }

  // Get all stories for the current user
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "user_id" } },
          { field: { Name: "prompt" } },
          { field: { Name: "enhanced_prompt" } },
          { field: { Name: "llm_used" } },
          { field: { Name: "story_text" } },
          { field: { Name: "image_urls" } },
          { field: { Name: "character_count" } },
          { field: { Name: "illustration_count" } },
          { field: { Name: "illustration_style" } },
          { field: { Name: "title" } },
          { field: { Name: "created_at" } },
          { field: { Name: "pdf_url" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
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
        console.error("Error fetching stories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  // Get story by ID
  async getById(storyId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "user_id" } },
          { field: { Name: "prompt" } },
          { field: { Name: "enhanced_prompt" } },
          { field: { Name: "llm_used" } },
          { field: { Name: "story_text" } },
          { field: { Name: "image_urls" } },
          { field: { Name: "character_count" } },
          { field: { Name: "illustration_count" } },
          { field: { Name: "illustration_style" } },
          { field: { Name: "title" } },
          { field: { Name: "created_at" } },
          { field: { Name: "pdf_url" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, storyId, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching story with ID ${storyId}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Create a new story (only includes updateable fields)
async create(storyData) {
    try {
      // Helper function to compress image URLs to fit within 255 character limit
      const compressImageUrls = (urls) => {
        if (!urls) return '';
        if (!Array.isArray(urls)) return urls.toString().substring(0, 250);
        
        // Convert to JSON string
        const jsonString = JSON.stringify(urls);
        
        // If within limit, return as is
        if (jsonString.length <= 250) {
          return jsonString;
        }
        
        // Compress by taking only essential parts of URLs (filename/id)
        const compressedUrls = urls.map(url => {
          if (typeof url === 'string') {
            // Extract just the filename or last segment
            const segments = url.split('/');
            const filename = segments[segments.length - 1];
            // Keep only first 30 chars of filename to ensure we fit
            return filename.substring(0, 30);
          }
          return url;
        });
        
        const compressedJson = JSON.stringify(compressedUrls);
        // Final safety check - truncate if still too long
        return compressedJson.substring(0, 250);
      };

      const params = {
        records: [
          {
            // Only include updateable fields based on field visibility
            Name: storyData.title || storyData.Name,
            Tags: storyData.Tags || '',
            user_id: storyData.user_id,
            prompt: storyData.prompt,
            enhanced_prompt: storyData.enhanced_prompt,
            llm_used: storyData.llm_used,
            story_text: storyData.story_text,
            image_urls: compressImageUrls(storyData.image_urls),
            character_count: parseInt(storyData.character_count) || 0,
            illustration_count: parseInt(storyData.illustration_count) || 0,
            illustration_style: storyData.illustration_style,
            title: storyData.title,
            created_at: storyData.created_at || new Date().toISOString(),
            pdf_url: storyData.pdf_url || null
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
          console.error(`Failed to create ${failedRecords.length} story records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success('Story created successfully!');
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating story:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Update an existing story (only includes updateable fields)
async update(storyId, updateData) {
    try {
      // Helper function to compress image URLs to fit within 255 character limit
      const compressImageUrls = (urls) => {
        if (!urls) return '';
        if (!Array.isArray(urls)) return urls.toString().substring(0, 250);
        
        // Convert to JSON string
        const jsonString = JSON.stringify(urls);
        
        // If within limit, return as is
        if (jsonString.length <= 250) {
          return jsonString;
        }
        
        // Compress by taking only essential parts of URLs (filename/id)
        const compressedUrls = urls.map(url => {
          if (typeof url === 'string') {
            // Extract just the filename or last segment
            const segments = url.split('/');
            const filename = segments[segments.length - 1];
            // Keep only first 30 chars of filename to ensure we fit
            return filename.substring(0, 30);
          }
          return url;
        });
        
        const compressedJson = JSON.stringify(compressedUrls);
        // Final safety check - truncate if still too long
        return compressedJson.substring(0, 250);
      };

      const params = {
        records: [
          {
            Id: parseInt(storyId),
            // Only include updateable fields based on field visibility
            ...(updateData.Name !== undefined && { Name: updateData.Name }),
            ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
            ...(updateData.user_id !== undefined && { user_id: updateData.user_id }),
            ...(updateData.prompt !== undefined && { prompt: updateData.prompt }),
            ...(updateData.enhanced_prompt !== undefined && { enhanced_prompt: updateData.enhanced_prompt }),
            ...(updateData.llm_used !== undefined && { llm_used: updateData.llm_used }),
            ...(updateData.story_text !== undefined && { story_text: updateData.story_text }),
            ...(updateData.image_urls !== undefined && { 
              image_urls: compressImageUrls(updateData.image_urls)
            }),
            ...(updateData.character_count !== undefined && { character_count: parseInt(updateData.character_count) }),
            ...(updateData.illustration_count !== undefined && { illustration_count: parseInt(updateData.illustration_count) }),
            ...(updateData.illustration_style !== undefined && { illustration_style: updateData.illustration_style }),
            ...(updateData.title !== undefined && { title: updateData.title }),
            ...(updateData.created_at !== undefined && { created_at: updateData.created_at }),
            ...(updateData.pdf_url !== undefined && { pdf_url: updateData.pdf_url })
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
          console.error(`Failed to update ${failedUpdates.length} story records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          toast.success('Story updated successfully!');
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating story:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }

  // Delete a story
  async delete(storyId) {
    try {
      const params = {
        RecordIds: [parseInt(storyId)]
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
          console.error(`Failed to delete ${failedDeletions.length} story records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulDeletions.length > 0) {
          toast.success('Story deleted successfully!');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting story:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }

  // Get recent stories with limit
  async getRecentStories(limit = 6) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "image_urls" } },
          { field: { Name: "character_count" } },
          { field: { Name: "illustration_count" } },
          { field: { Name: "illustration_style" } },
          { field: { Name: "created_at" } }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching recent stories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  // Search stories by query
  async searchStories(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "prompt" } },
          { field: { Name: "story_text" } },
          { field: { Name: "image_urls" } },
          { field: { Name: "character_count" } },
          { field: { Name: "illustration_count" } },
          { field: { Name: "illustration_style" } },
          { field: { Name: "created_at" } }
        ],
        where: [
          {
            FieldName: "title",
            Operator: "Contains",
            Values: [query],
            Include: true
          }
        ],
        orderBy: [
          { fieldName: "created_at", sorttype: "DESC" }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error searching stories:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  // Regenerate illustration for a story
  async regenerateIllustration(storyId, illustrationIndex, sceneDescription) {
    try {
      // In a real implementation, this would trigger illustration regeneration
      // For now, we'll update the story with a new random image
      const newImageUrl = `https://picsum.photos/400/300?random=${Date.now()}`;
      
      const story = await this.getById(storyId);
      if (!story) return null;

      let imageUrls = [];
      try {
        imageUrls = typeof story.image_urls === 'string' ? JSON.parse(story.image_urls) : story.image_urls || [];
      } catch (e) {
        imageUrls = [];
      }

      if (illustrationIndex < imageUrls.length) {
        imageUrls[illustrationIndex] = newImageUrl;
      }

      const updatedStory = await this.update(storyId, {
        image_urls: JSON.stringify(imageUrls)
      });

      if (updatedStory) {
        toast.success('Illustration regenerated successfully!');
      }

      return updatedStory;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error regenerating illustration:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      toast.error('Failed to regenerate illustration');
return null;
    }
  }
}

export const storiesService = new StoriesService();