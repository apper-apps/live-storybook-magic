import React from "react";
let pipeline = null;
let isLoading = false;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 30000; // 30 seconds

// Advanced fallback enhancement function with sophisticated storytelling elements
function fallbackEnhancement(prompt) {
  // Extract key elements from the original prompt to build upon
  const promptWords = prompt.toLowerCase().split(' ');
  
  // Determine story themes and elements based on prompt content
  const storyElements = {
    characters: extractCharacters(promptWords),
    settings: extractSettings(promptWords),
    themes: extractThemes(promptWords),
    conflicts: generateConflicts(promptWords),
    emotions: generateEmotions(promptWords)
  };
  
  // Create a sophisticated, multi-layered enhancement
  const enhancedPrompt = `Create an enchanting and richly detailed children's story about ${prompt}. 

**Character Development**: ${storyElements.characters} Each character should have distinctive personality traits, motivations, and growth arcs that children can relate to and learn from.

**Vivid Setting**: ${storyElements.settings} The world should feel magical yet believable, with sensory details that help young readers visualize and immerse themselves in the story.

**Engaging Plot Structure**: 
- Opening: Establish the character's ordinary world and introduce the central challenge or mystery
- Rising Action: ${storyElements.conflicts} Include obstacles that test the character's courage, kindness, and problem-solving abilities
- Climax: A pivotal moment where the character must use everything they've learned to overcome the main challenge
- Resolution: ${storyElements.emotions} Show how the character has grown and what valuable life lessons they've discovered

**Themes and Messages**: Weave in age-appropriate themes of ${storyElements.themes} while maintaining an optimistic, hopeful tone that celebrates friendship, perseverance, and the power of believing in oneself.

**Literary Elements**: Use rich, descriptive language with gentle humor, meaningful dialogue, and moments of wonder that spark imagination. Include subtle foreshadowing and satisfying callbacks that make the story feel cohesive and rewarding.

**Educational Value**: Naturally incorporate learning opportunities about emotions, social skills, problem-solving, and moral decision-making without being preachy or heavy-handed.

The story should be suitable for children aged 4-8, with a perfect balance of adventure, heart, and wisdom that creates lasting memories and inspires repeated readings.`;

  return enhancedPrompt;
}

// Helper functions for sophisticated prompt analysis
function extractCharacters(words) {
  const characterIndicators = ['bunny', 'dragon', 'princess', 'knight', 'girl', 'boy', 'cat', 'dog', 'bird', 'fox', 'bear', 'mouse', 'child', 'kid'];
  const foundCharacters = words.filter(word => characterIndicators.includes(word));
  
  if (foundCharacters.length > 0) {
    return `Develop ${foundCharacters.join(' and ')} as fully realized characters with unique voices, dreams, and personalities that shine through their actions and dialogue.`;
  }
  return `Create memorable, relatable characters with distinct personalities, clear motivations, and the capacity for meaningful growth throughout their journey.`;
}

function extractSettings(words) {
  const settingWords = ['forest', 'castle', 'ocean', 'mountain', 'garden', 'school', 'home', 'village', 'city', 'space', 'underwater', 'magical', 'enchanted'];
  const foundSettings = words.filter(word => settingWords.includes(word));
  
  if (foundSettings.length > 0) {
    return `Set the story in a beautifully crafted ${foundSettings.join(' and ')} environment with rich atmospheric details, interesting locations to explore, and settings that actively contribute to the plot development.`;
  }
  return `Create an immersive, imaginative setting that feels both wondrous and authentic, with detailed environments that enhance the story's emotional impact and provide opportunities for discovery.`;
}

function extractThemes(words) {
  const themeMap = {
    'friend': 'friendship and loyalty',
    'brave': 'courage and bravery',
    'kind': 'kindness and empathy',
    'help': 'helping others and community',
    'learn': 'learning and growth',
    'magic': 'wonder and possibility',
    'adventure': 'exploration and discovery',
    'family': 'family bonds and love'
  };
  
  const identifiedThemes = [];
  words.forEach(word => {
    if (themeMap[word]) {
      identifiedThemes.push(themeMap[word]);
    }
  });
  
  if (identifiedThemes.length > 0) {
    return identifiedThemes.join(', ') + ', personal growth, and the importance of staying true to oneself';
  }
  return 'friendship, courage, kindness, perseverance, self-discovery, and the magic that exists in everyday moments';
}

function generateConflicts(words) {
  const conflictTypes = [
    'Present challenges that require creative thinking and collaboration with friends',
    'Include obstacles that test the character\'s values and moral compass',
    'Create situations where the character must overcome self-doubt and fear',
    'Develop conflicts that can only be resolved through kindness and understanding'
  ];
  return conflictTypes[Math.floor(Math.random() * conflictTypes.length)];
}

function generateEmotions(words) {
  const emotionalJourneys = [
    'Conclude with a heartwarming resolution that celebrates the character\'s journey and the bonds they\'ve formed',
    'End with a sense of accomplishment and newfound confidence that inspires young readers',
    'Finish with a touching moment that reinforces the story\'s themes while opening possibilities for future adventures',
    'Close with a satisfying conclusion that leaves readers feeling hopeful, empowered, and eager to apply the story\'s lessons'
  ];
  return emotionalJourneys[Math.floor(Math.random() * emotionalJourneys.length)];
}

// Initialize transformers with robust error handling
async function initializeTransformers() {
  if (pipeline) return pipeline;
  if (isLoading) {
    // Wait for current initialization to complete
    while (isLoading && initializationAttempts < MAX_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return pipeline;
  }

  isLoading = true;
  initializationAttempts++;

  try {
    console.log(`Attempting to initialize Transformers.js (attempt ${initializationAttempts}/${MAX_ATTEMPTS})`);
    
    // Import with timeout
    const { pipeline: createPipeline } = await Promise.race([
      import('@xenova/transformers'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transformers import timeout')), TIMEOUT_MS)
      )
    ]);

    // Create pipeline with timeout
    pipeline = await Promise.race([
      createPipeline('text2text-generation', 'Xenova/flan-t5-small'),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Pipeline creation timeout')), TIMEOUT_MS)
      )
    ]);

    console.log('Transformers.js initialized successfully');
    isLoading = false;
    return pipeline;

  } catch (error) {
    isLoading = false;
    console.warn(`Transformers.js initialization failed (attempt ${initializationAttempts}):`, error.message);
    
    // If we've exhausted all attempts, use fallback
    if (initializationAttempts >= MAX_ATTEMPTS) {
      console.log('Using fallback enhancement method');
      return null; // Indicates fallback mode
    }
    
    // Retry with exponential backoff
    const delay = Math.min(1000 * Math.pow(2, initializationAttempts - 1), 10000);
    await new Promise(resolve => setTimeout(resolve, delay));
    return initializeTransformers();
  }
}

// Enhanced prompt function with fallback
async function enhancePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return 'Tell a wonderful story for children.';
  }

  try {
    const transformerPipeline = await initializeTransformers();
    
    // If transformers failed to initialize, use fallback
    if (!transformerPipeline) {
      console.log('Using fallback prompt enhancement');
      return fallbackEnhancement(prompt);
    }

    // Use transformers for enhancement
    const enhanced = await Promise.race([
      transformerPipeline(`enhance this story prompt: ${prompt}`),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Enhancement timeout')), 15000)
      )
    ]);

    return enhanced[0]?.generated_text || fallbackEnhancement(prompt);

  } catch (error) {
    console.warn('Prompt enhancement failed, using fallback:', error.message);
    return fallbackEnhancement(prompt);
  }
}

// Reset function for testing/debugging
function resetTransformers() {
  pipeline = null;
  isLoading = false;
  initializationAttempts = 0;
}

// Health check function
async function checkTransformersHealth() {
  try {
    const result = await enhancePrompt('test prompt');
    return {
      status: 'healthy',
      usingFallback: !pipeline,
      result: result?.substring(0, 50) + '...'
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message,
      usingFallback: true
    };
  }
}

export { 
  enhancePrompt, 
  initializeTransformers, 
  resetTransformers, 
  checkTransformersHealth 
};