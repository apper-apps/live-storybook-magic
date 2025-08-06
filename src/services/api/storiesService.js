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
          { field: { Name: "target_age_group" } },
          { field: { Name: "character_name" } },
          { field: { Name: "character_appearance" } },
          { field: { Name: "character_personality" } },
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
          { field: { Name: "target_age_group" } },
          { field: { Name: "character_name" } },
          { field: { Name: "character_appearance" } },
          { field: { Name: "character_personality" } },
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
        if (!Array.isArray(urls)) return urls.toString().substring(0, 240);
        
        // Convert to JSON string
        const jsonString = JSON.stringify(urls);
        
        // If within limit, return as is
        if (jsonString.length <= 240) {
          return jsonString;
        }
        
        // More aggressive compression - extract minimal identifiers
        const compressedUrls = urls.map((url, index) => {
          if (typeof url === 'string') {
            // Try to extract query parameters or filename
            const urlParts = url.split('?');
            const queryPart = urlParts[1];
            if (queryPart) {
              // Extract meaningful part from query (like random=bunny1)
              const match = queryPart.match(/random=([^&]+)/);
              if (match) return match[1].substring(0, 20);
            }
            // Fallback: use index-based identifier
            return `img${index}_${Date.now().toString().slice(-4)}`;
          }
          return `img${index}`;
        });
        
        const compressedJson = JSON.stringify(compressedUrls);
        // Absolute safety check - truncate to guarantee under limit
        return compressedJson.substring(0, 240);
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
            pdf_url: storyData.pdf_url || null,
            target_age_group: storyData.target_age_group,
            character_name: storyData.character_name,
            character_appearance: storyData.character_appearance || null,
            character_personality: storyData.character_personality || null
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
        if (!Array.isArray(urls)) return urls.toString().substring(0, 240);
        
        // Convert to JSON string
        const jsonString = JSON.stringify(urls);
        
        // If within limit, return as is
        if (jsonString.length <= 240) {
          return jsonString;
        }
        
        // More aggressive compression - extract minimal identifiers
        const compressedUrls = urls.map((url, index) => {
          if (typeof url === 'string') {
            // Try to extract query parameters or filename
            const urlParts = url.split('?');
            const queryPart = urlParts[1];
            if (queryPart) {
              // Extract meaningful part from query (like random=bunny1)
              const match = queryPart.match(/random=([^&]+)/);
              if (match) return match[1].substring(0, 20);
            }
            // Fallback: use index-based identifier
            return `img${index}_${Date.now().toString().slice(-4)}`;
          }
          return `img${index}`;
        });
        
        const compressedJson = JSON.stringify(compressedUrls);
        // Absolute safety check - truncate to guarantee under limit
        return compressedJson.substring(0, 240);
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
            ...(updateData.pdf_url !== undefined && { pdf_url: updateData.pdf_url }),
            ...(updateData.target_age_group !== undefined && { target_age_group: updateData.target_age_group }),
            ...(updateData.character_name !== undefined && { character_name: updateData.character_name }),
            ...(updateData.character_appearance !== undefined && { character_appearance: updateData.character_appearance }),
            ...(updateData.character_personality !== undefined && { character_personality: updateData.character_personality })
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
          { field: { Name: "target_age_group" } },
          { field: { Name: "character_name" } },
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
          { field: { Name: "target_age_group" } },
          { field: { Name: "character_name" } },
          { field: { Name: "character_appearance" } },
          { field: { Name: "character_personality" } },
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
      const story = await this.getById(storyId);
      if (!story) return null;

      let imageUrls = [];
      try {
        imageUrls = typeof story.image_urls === 'string' ? JSON.parse(story.image_urls) : story.image_urls || [];
      } catch (e) {
        imageUrls = [];
      }

      // Generate contextual illustration based on story content and style
      const storyElements = this.extractStoryElements(story.story_text, story.prompt);
      const illustrationStyle = story.illustration_style || 'cartoon';
      
      // Create scene-specific illustration URL that matches the story content
      const sceneContext = this.generateSceneContext(storyElements, illustrationIndex, illustrationStyle);
      const newImageUrl = `https://picsum.photos/400/300?random=${sceneContext.seed}&style=${illustrationStyle}&scene=${sceneContext.description}`;

      if (illustrationIndex < imageUrls.length) {
        imageUrls[illustrationIndex] = newImageUrl;
      }

      const updatedStory = await this.update(storyId, {
        image_urls: JSON.stringify(imageUrls)
      });

      if (updatedStory) {
        toast.success(`${illustrationStyle.charAt(0).toUpperCase() + illustrationStyle.slice(1)} illustration regenerated for scene ${illustrationIndex + 1}!`);
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

// Extract key story elements for contextual illustration generation with enhanced prompt processing
// Storybook Magic: Extract story elements for character consistency and age-appropriate content
  extractStoryElements(storyText, prompt, enhancedPrompt = null, targetAgeGroup = '1-2', characterName = null) {
    const combinedText = `${storyText || ''} ${prompt || ''} ${enhancedPrompt || ''}`.toLowerCase();
    
    const elements = {
      characters: this.extractCharacterTypes(combinedText),
      settings: this.extractSettingTypes(combinedText),
      mood: this.extractMoodTypes(combinedText),
      actions: this.extractActionTypes(combinedText),
      themes: this.extractThemeTypes(combinedText),
      goals: this.extractUserGoals(combinedText),
      ageGroup: targetAgeGroup,
      mainCharacter: characterName || this.generateCharacterName(combinedText),
      characterAppearance: this.generateCharacterAppearance(combinedText, characterName),
      characterPersonality: this.generateCharacterPersonality(combinedText, targetAgeGroup)
    };

    return elements;
  }

  // Generate appropriate character name based on story content
  generateCharacterName(text) {
    const characters = this.extractCharacterTypes(text);
    const nameMap = {
      'rabbit': ['Bouncy', 'Hopscotch', 'Clover', 'Nibbles'],
      'dragon': ['Sparkle', 'Ember', 'Rainbow', 'Puff'],
      'princess': ['Luna', 'Rose', 'Aria', 'Belle'],
      'child': ['Lily', 'Max', 'Sophie', 'Sam'],
      'cat': ['Whiskers', 'Mittens', 'Shadow', 'Luna'],
      'dog': ['Buddy', 'Daisy', 'Charlie', 'Ruby'],
      'fox': ['Rusty', 'Amber', 'Clever', 'Swift'],
      'bear': ['Honey', 'Cocoa', 'Cuddles', 'Bruno'],
      'bird': ['Chirpy', 'Melody', 'Sky', 'Feather'],
      'fairy': ['Twinkle', 'Shimmer', 'Stardust', 'Bloom']
    };

    const mainCharacter = characters[0] || 'character';
    const names = nameMap[mainCharacter] || ['Buddy', 'Sunny', 'Happy', 'Joy'];
    return names[Math.floor(Math.random() * names.length)];
  }

  // Generate character appearance description
  generateCharacterAppearance(text, characterName) {
    const characters = this.extractCharacterTypes(text);
    const mainCharacter = characters[0] || 'character';
    
    const appearanceMap = {
      'rabbit': 'A fluffy bunny with soft ears, bright eyes, and a cotton-tail that bounces when happy',
      'dragon': 'A friendly dragon with colorful scales that shimmer in the sunlight and kind, gentle eyes',
      'princess': 'A kind princess with flowing hair, a beautiful dress, and a warm, welcoming smile',
      'child': 'A cheerful child with bright eyes, rosy cheeks, and clothes perfect for adventures',
      'cat': 'A soft, cuddly cat with whiskers that twitch with curiosity and paws that pad quietly',
      'dog': 'A loyal dog with a wagging tail, floppy ears, and eyes full of friendship and joy',
      'fox': 'A clever fox with a bushy tail, pointed ears, and bright, intelligent eyes',
      'bear': 'A gentle bear with soft fur, kind eyes, and paws perfect for giving warm hugs',
      'bird': 'A colorful bird with beautiful feathers, bright eyes, and wings that love to soar',
      'fairy': 'A magical fairy with delicate wings, sparkling clothes, and a wand that glimmers'
    };

    return appearanceMap[mainCharacter] || 'A wonderful character with kind eyes and a gentle heart, ready for magical adventures';
  }

  // Generate age-appropriate character personality
  generateCharacterPersonality(text, ageGroup) {
    const baseTraits = ['kind', 'curious', 'brave', 'friendly', 'helpful'];
    
    const ageSpecificTraits = {
      '1-2': ['gentle', 'playful', 'loving', 'simple', 'caring'],
      '3-5': ['adventurous', 'imaginative', 'cheerful', 'resourceful', 'loyal'],
      '6-8': ['determined', 'creative', 'thoughtful', 'problem-solving', 'confident'],
      '9-12': ['wise', 'empathetic', 'independent', 'responsible', 'inspiring']
    };

    const traits = [...baseTraits, ...(ageSpecificTraits[ageGroup] || ageSpecificTraits['1-2'])];
    const selectedTraits = traits.slice(0, 3);
    
    return `A ${selectedTraits.join(', ')} character who learns important lessons and helps others along the way. Perfect for inspiring young readers aged ${ageGroup}.`;
    // Combine all available text sources for comprehensive analysis
    const combinedText = [storyText, prompt, enhancedPrompt]
      .filter(text => text && text.trim())
      .join(' ')
      .toLowerCase();
    
    return {
      characters: this.extractCharacterTypes(combinedText),
      settings: this.extractSettingTypes(combinedText),
      mood: this.extractMoodTypes(combinedText),
      actions: this.extractActionTypes(combinedText),
      themes: this.extractThemeTypes(combinedText),
      goals: this.extractUserGoals(combinedText)
    };
  }

extractCharacterTypes(text) {
    const characters = [];
    const characterMap = {
      'bunny': 'rabbit', 'rabbit': 'rabbit', 'dragon': 'dragon', 'princess': 'princess', 
      'knight': 'knight', 'girl': 'child', 'boy': 'child', 'cat': 'cat', 'dog': 'dog', 
      'fox': 'fox', 'bear': 'bear', 'bird': 'bird', 'owl': 'owl', 'mouse': 'mouse',
      'fairy': 'fairy', 'wizard': 'wizard', 'unicorn': 'unicorn', 'mermaid': 'mermaid',
      'pirate': 'pirate', 'astronaut': 'astronaut', 'detective': 'detective',
      'puppy': 'dog', 'kitten': 'cat', 'chick': 'bird', 'lamb': 'sheep'
    };
    
    Object.keys(characterMap).forEach(key => {
      if (text.includes(key)) characters.push(characterMap[key]);
    });
    
    return characters.length > 0 ? [...new Set(characters)] : ['character'];
  }

  extractSettingTypes(text) {
    const settings = [];
    const settingMap = {
      'forest': 'woodland', 'woods': 'woodland', 'castle': 'castle', 'palace': 'castle',
      'ocean': 'seaside', 'sea': 'seaside', 'beach': 'seaside', 'mountain': 'mountain',
      'garden': 'garden', 'school': 'school', 'classroom': 'school', 'home': 'house', 
      'house': 'house', 'village': 'village', 'town': 'village', 'city': 'city',
      'magical': 'enchanted', 'enchanted': 'enchanted', 'space': 'cosmic', 
      'underwater': 'underwater', 'farm': 'farm', 'jungle': 'jungle', 
      'desert': 'desert', 'island': 'island', 'cave': 'cave', 'meadow': 'meadow',
      'playground': 'playground', 'park': 'park', 'library': 'library'
    };
    
    Object.keys(settingMap).forEach(key => {
      if (text.includes(key)) settings.push(settingMap[key]);
    });
    
    return settings.length > 0 ? [...new Set(settings)] : ['meadow'];
  }

  extractMoodTypes(text) {
    if (text.includes('adventure') || text.includes('exciting') || text.includes('thrilling')) return 'adventurous';
    if (text.includes('peaceful') || text.includes('calm') || text.includes('serene')) return 'peaceful';
    if (text.includes('magical') || text.includes('wonder') || text.includes('mystical')) return 'magical';
    if (text.includes('happy') || text.includes('joy') || text.includes('cheerful')) return 'joyful';
    if (text.includes('mysterious') || text.includes('secret') || text.includes('hidden')) return 'mysterious';
    if (text.includes('funny') || text.includes('silly') || text.includes('humorous')) return 'playful';
    if (text.includes('gentle') || text.includes('soft') || text.includes('tender')) return 'gentle';
    return 'cheerful';
  }

  extractActionTypes(text) {
    const actions = [];
    const actionMap = {
      'flying': 'flying', 'running': 'running', 'swimming': 'swimming',
      'dancing': 'dancing', 'playing': 'playing', 'exploring': 'exploring',
      'cooking': 'cooking', 'reading': 'reading', 'singing': 'singing',
      'building': 'building', 'painting': 'painting', 'climbing': 'climbing',
      'racing': 'racing', 'helping': 'helping', 'saving': 'rescuing',
      'discovering': 'discovering', 'learning': 'learning', 'jumping': 'jumping',
      'laughing': 'laughing', 'hugging': 'hugging', 'sharing': 'sharing'
    };
    
    Object.keys(actionMap).forEach(key => {
      if (text.includes(key)) actions.push(actionMap[key]);
    });
    
    return actions.length > 0 ? [...new Set(actions)] : ['exploring'];
  }

  extractThemeTypes(text) {
    const themes = [];
    const themeMap = {
      'friendship': 'friendship', 'friend': 'friendship', 'courage': 'courage', 'brave': 'courage',
      'kindness': 'kindness', 'kind': 'kindness', 'love': 'love', 'family': 'family',
      'learning': 'learning', 'school': 'learning', 'nature': 'nature', 'environment': 'nature',
      'teamwork': 'cooperation', 'together': 'cooperation', 'helping': 'helpfulness',
      'dream': 'dreams', 'wish': 'dreams', 'grow': 'growth', 'change': 'growth',
      'adventure': 'adventure', 'discovery': 'discovery', 'magic': 'magic'
    };
    
    Object.keys(themeMap).forEach(key => {
      if (text.includes(key)) themes.push(themeMap[key]);
    });
    
    return themes.length > 0 ? [...new Set(themes)] : ['friendship'];
  }

  extractUserGoals(text) {
    // Storybook Magic: Analyze prompts for user intentions and educational goals
    const goals = [];
    
    if (text.includes('teach') || text.includes('learn') || text.includes('lesson')) {
      goals.push('educational');
    }
    if (text.includes('bedtime') || text.includes('sleep') || text.includes('calm')) {
      goals.push('bedtime');
    }
    if (text.includes('inspire') || text.includes('motivate') || text.includes('encourage')) {
      goals.push('inspirational');
    }
    if (text.includes('fun') || text.includes('entertain') || text.includes('laugh')) {
      goals.push('entertainment');
    }
    if (text.includes('moral') || text.includes('value') || text.includes('character')) {
      goals.push('moral');
    }
    if (text.includes('age') || text.includes('toddler') || text.includes('preschool')) {
      goals.push('age-appropriate');
    }
    
    return goals.length > 0 ? [...new Set(goals)] : ['general'];
  }

  // Storybook Magic: Generate enhanced scene-specific context for consistent illustrations
  generateSceneContext(elements, sceneIndex, style, ageGroup = '1-2') {
    const character = elements.mainCharacter || elements.characters[0] || 'character';
    const setting = elements.settings[0] || 'meadow';
    const mood = elements.mood || 'cheerful';
    const action = elements.actions[0] || 'exploring';
    const theme = elements.themes[0] || 'friendship';
    const goal = elements.goals[0] || 'general';
    
    // Age-appropriate scene descriptions for consistent character illustration
    const ageAppropriateScenes = {
      '1-2': [
        `${character} waking up in cozy ${setting}`,
        `${character} ${action} with gentle expression`,
        `${character} discovering something wonderful`,
        `${character} making a new friend`,
        `${character} feeling ${mood} and content`,
        `${character} sharing with others`,
        `${character} learning something simple`,
        `${character} going to sleep peacefully`
      ],
      '3-5': [
        `${character} beginning adventure in ${setting}`,
        `${character} ${action} with curiosity and wonder`,
        `${character} facing a small challenge bravely`,
        `${character} helping a friend in need`,
        `${character} celebrating ${theme}`,
        `${character} solving a simple problem`,
        `${character} expressing ${mood} emotions`,
        `${character} completing the journey successfully`
      ]
    };

    const sceneTemplates = ageAppropriateScenes[ageGroup] || ageAppropriateScenes['1-2'];
    const selectedScene = sceneTemplates[sceneIndex % sceneTemplates.length];
    
    const seed = `${character}_${setting}_${sceneIndex}_${style}_${Date.now()}`;
    
    return {
      description: selectedScene,
      seed: seed,
      prompt: `A ${style} illustration showing ${selectedScene}, with consistent character appearance throughout, ${mood} mood, suitable for ages ${ageGroup}`,
      caption: selectedScene,
      context: {
        character: character,
        setting: setting,
        mood: mood,
        action: action,
        theme: theme,
        goal: goal,
        ageGroup: ageGroup,
        appearance: elements.characterAppearance,
        personality: elements.characterPersonality
      }
    };
  }
}

export const storiesService = new StoriesService();