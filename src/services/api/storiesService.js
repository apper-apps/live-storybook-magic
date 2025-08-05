import { toast } from 'react-toastify';

class StoriesService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'story';
    
    // Define all available fields from the database schema
    this.allFields = [
      { field: { Name: "Name" } },
      { field: { Name: "Tags" } },
      { field: { Name: "Owner" } },
      { field: { Name: "CreatedOn" } },
      { field: { Name: "CreatedBy" } },
      { field: { Name: "ModifiedOn" } },
      { field: { Name: "ModifiedBy" } },
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
      { field: { Name: "pdf_url" } }
    ];
    
    // Define updateable fields only (exclude System fields)
    this.updateableFields = [
      "Name", "Tags", "user_id", "prompt", "enhanced_prompt", 
      "llm_used", "story_text", "image_urls", "character_count", 
      "illustration_count", "illustration_style", "title", 
      "created_at", "pdf_url"
    ];
  }

  async getAll() {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
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
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error fetching stories:", error.message);
        toast.error("Failed to fetch stories");
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: this.allFields
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching story with ID ${id}:`, error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error(`Error fetching story with ID ${id}:`, error.message);
        toast.error("Failed to fetch story");
      }
      return null;
    }
  }

  async create(storyData) {
    try {
      // If no API key provided or mock generation requested, use mock story generation
      if (!storyData.apiKey || storyData.useMockGeneration) {
        return await this.createMockStory(storyData);
      }
      
      // Filter to only include updateable fields
      const filteredData = {};
      this.updateableFields.forEach(field => {
        if (storyData[field] !== undefined) {
          filteredData[field] = storyData[field];
        }
      });
      
      // Set default values and ensure proper formatting
      const recordData = {
        Name: storyData.title || `Story: ${storyData.prompt?.substring(0, 50)}...`,
        Tags: storyData.tags || "",
        user_id: storyData.user_id || null,
        prompt: storyData.prompt,
        enhanced_prompt: storyData.enhanced_prompt || null,
        llm_used: storyData.llm_used,
        story_text: storyData.story_text,
        image_urls: Array.isArray(storyData.image_urls) ? storyData.image_urls.join(',') : (storyData.image_urls || ""),
        character_count: parseInt(storyData.character_count) || 800,
        illustration_count: parseInt(storyData.illustration_count) || 10,
        illustration_style: storyData.illustration_style || "cartoon",
        title: storyData.title || null,
        created_at: new Date().toISOString(),
        pdf_url: storyData.pdf_url || null
      };
      
      const params = {
        records: [recordData]
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
          toast.success("Story created successfully!");
          return successfulRecords[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating story:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error creating story:", error.message);
        toast.error("Failed to create story");
      }
      return null;
    }
  }

  async update(id, updateData) {
    try {
      // Filter to only include updateable fields
      const filteredData = { Id: parseInt(id) };
      this.updateableFields.forEach(field => {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      });
      
      // Handle image_urls array formatting
      if (filteredData.image_urls && Array.isArray(filteredData.image_urls)) {
        filteredData.image_urls = filteredData.image_urls.join(',');
      }
      
      const params = {
        records: [filteredData]
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
          toast.success("Story updated successfully!");
          return successfulUpdates[0].data;
        }
      }
      
      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating story:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error updating story:", error.message);
        toast.error("Failed to update story");
      }
      return null;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
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
          toast.success("Story deleted successfully!");
          return true;
        }
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting story:", error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      } else {
        console.error("Error deleting story:", error.message);
        toast.error("Failed to delete story");
      }
      return false;
    }
  }

  // Additional methods for story-specific operations
  async getRecentStories(limit = 6) {
    try {
      const params = {
        fields: this.allFields,
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
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
      console.error("Error fetching recent stories:", error.message);
      return [];
    }
  }

  async searchStories(query) {
    try {
      const params = {
        fields: this.allFields,
        where: [
          {
            FieldName: "prompt",
            Operator: "Contains",
            Values: [query]
          }
        ],
        orderBy: [
          {
            fieldName: "created_at",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error searching stories:", error.message);
      return [];
    }
  }

  // Regenerate individual illustration - kept for compatibility
  async regenerateIllustration(storyId, illustrationIndex, sceneDescription) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    // In a real implementation, this would call DALL-E API with adjusted prompt
    const adjustedPrompt = `Regenerate illustration of ${sceneDescription}`;
    
    const regeneratedIllustration = {
      scene_number: illustrationIndex + 1,
      description: sceneDescription,
      dalle_prompt: adjustedPrompt,
      image_url: `https://picsum.photos/400/300?random=${Date.now()}-regenerated-${illustrationIndex}`,
      caption: `Regenerated scene ${illustrationIndex + 1}`
    };

    return regeneratedIllustration;
  }

  // Mock story generation for when no API keys are configured - kept for compatibility
  async createMockStory(storyData) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    const mockStoryText = this.generateMockStoryText(storyData.prompt, storyData.character_count || 800);
    const mockImages = this.generateMockImages(storyData.illustration_count || 10);
    const mockTitle = this.generateTitleFromPrompt(storyData.prompt);
    
    const mockStoryRecord = {
      Name: mockTitle,
      Tags: storyData.tags || "",
      user_id: storyData.user_id || null,
      prompt: storyData.prompt,
      enhanced_prompt: storyData.enhanced_prompt || null,
      llm_used: storyData.llm_used || 'mock',
      story_text: mockStoryText,
      image_urls: mockImages.join(','),
      character_count: parseInt(storyData.character_count) || 800,
      illustration_count: parseInt(storyData.illustration_count) || 10,
      illustration_style: storyData.illustration_style || "cartoon",
      title: mockTitle,
      created_at: new Date().toISOString(),
      pdf_url: null
    };

    // Create the record in the database
    return await this.create(mockStoryRecord);
  }

  generateMockStoryText(prompt, characterCount) {
    const words = prompt.toLowerCase().split(' ');
    const keyWords = words.filter(word => word.length > 3);
    const mainWord = keyWords[0] || 'adventure';
    
    const baseStory = `Once upon a time, there was a magical ${mainWord} that captured everyone's imagination. The story began in a wonderful place where dreams come true and anything is possible. Characters embarked on an incredible journey filled with excitement, wonder, and discovery. Along the way, they met fascinating friends who helped them overcome challenges with courage and kindness. Each step of their adventure revealed new mysteries and brought them closer to their ultimate goal. The tale unfolded with beautiful moments of friendship, bravery, and joy that touched the hearts of all who heard it.`;
    
    // Extend or trim the story to match the desired character count
    if (baseStory.length < characterCount) {
      const additionalText = " The adventure continued with even more exciting discoveries and heartwarming moments that brought everyone closer together. Magic sparkled in the air as the characters learned valuable lessons about friendship, courage, and believing in themselves. Their journey took them through enchanted forests, across sparkling rivers, and over magnificent mountains where they discovered that the greatest treasure of all was the bonds they had formed along the way.";
      return (baseStory + additionalText).substring(0, characterCount);
    }
    
    return baseStory.substring(0, characterCount);
  }

  generateMockImages(count) {
    const images = [];
    for (let i = 0; i < count; i++) {
      images.push(`https://picsum.photos/400/300?random=${Date.now()}-${i}`);
    }
    return images;
  }

  generateTitleFromPrompt(prompt) {
    const words = prompt.split(' ').slice(0, 3);
    const title = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return `The Tale of ${title}`;
  }
}

export const storiesService = new StoriesService();