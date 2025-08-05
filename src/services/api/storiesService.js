import storiesData from "@/services/mockData/stories.json";

class StoriesService {
  constructor() {
    this.stories = [...storiesData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.stories];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const story = this.stories.find(story => story.Id === parseInt(id));
    if (!story) {
      throw new Error("Story not found");
    }
    return { ...story };
  }

async create(storyData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // If no API key provided or mock generation requested, use mock story generation
    if (!storyData.apiKey || storyData.useMockGeneration) {
      return await this.createMockStory(storyData);
    }
    
    const newId = Math.max(...this.stories.map(s => s.Id), 0) + 1;
    const newStory = {
      Id: newId,
      user_id: null,
      prompt: storyData.prompt,
      enhanced_prompt: storyData.enhanced_prompt || null,
      llm_used: storyData.llm_used,
      story_text: storyData.story_text,
      image_urls: storyData.image_urls || [],
      character_count: storyData.character_count || 800,
      illustration_count: storyData.illustration_count || 10,
      illustration_style: storyData.illustration_style || "cartoon",
      title: storyData.title || null,
      created_at: new Date().toISOString(),
      pdf_url: storyData.pdf_url || null
    };

    this.stories.unshift(newStory);
    return { ...newStory };
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.stories.findIndex(story => story.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Story not found");
    }

    this.stories[index] = {
      ...this.stories[index],
      ...updateData,
      Id: parseInt(id) // Ensure ID doesn't change
    };

    return { ...this.stories[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.stories.findIndex(story => story.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Story not found");
    }

    const deletedStory = this.stories.splice(index, 1)[0];
    return { ...deletedStory };
  }
// Additional methods for story-specific operations
  async getRecentStories(limit = 6) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.stories
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit)
      .map(story => ({ ...story }));
  }

  async searchStories(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return this.stories
      .filter(story => 
        story.prompt.toLowerCase().includes(lowercaseQuery) ||
        story.story_text?.toLowerCase().includes(lowercaseQuery) ||
        story.title?.toLowerCase().includes(lowercaseQuery)
      )
      .map(story => ({ ...story }));
  }

  // Regenerate individual illustration
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
// Mock story generation for when no API keys are configured
  async createMockStory(storyData) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    
    const newId = Math.max(...this.stories.map(s => s.Id), 0) + 1;
    const mockStoryText = this.generateMockStoryText(storyData.prompt, storyData.character_count || 800);
    const mockImages = this.generateMockImages(storyData.illustration_count || 10);
    const mockTitle = this.generateTitleFromPrompt(storyData.prompt);
    
    const newStory = {
      Id: newId,
      user_id: null,
      prompt: storyData.prompt,
      enhanced_prompt: storyData.enhanced_prompt || null,
      llm_used: storyData.llm_used || 'mock',
      story_text: mockStoryText,
      image_urls: mockImages,
      character_count: storyData.character_count || 800,
      illustration_count: storyData.illustration_count || 10,
      illustration_style: storyData.illustration_style || "cartoon",
      title: mockTitle,
      created_at: new Date().toISOString(),
      pdf_url: null
    };

    this.stories.unshift(newStory);
    return { ...newStory };
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