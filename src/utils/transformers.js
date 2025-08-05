let pipeline = null;
let isLoading = false;

export const initializeTransformers = async () => {
  if (pipeline || isLoading) return pipeline;
  
  isLoading = true;
  try {
    const { pipeline: createPipeline } = await import("@xenova/transformers");
    pipeline = await createPipeline("text2text-generation", "Xenova/flan-t5-small");
    isLoading = false;
    return pipeline;
  } catch (error) {
    console.error("Failed to initialize Transformers.js:", error);
    isLoading = false;
    return null;
  }
};

export const enhancePrompt = async (originalPrompt) => {
  try {
    if (!pipeline) {
      await initializeTransformers();
    }
    
    if (!pipeline) {
      throw new Error("Transformers.js not available");
    }

    const enhancementPrompt = `Improve this children's story prompt to be more creative and detailed: "${originalPrompt}"`;
    
    const result = await pipeline(enhancementPrompt, {
      max_length: 200,
      temperature: 0.8,
      do_sample: true
    });
    
    return result[0]?.generated_text || originalPrompt;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    // Fallback enhancement logic
    return fallbackEnhancement(originalPrompt);
  }
};

const fallbackEnhancement = (prompt) => {
  const enhancements = [
    "A whimsical tale about",
    "An enchanting story of",
    "A magical adventure featuring",
    "A heartwarming journey with",
    "A delightful story about"
  ];
  
  const settings = [
    "in a colorful forest",
    "in a magical kingdom",
    "by a sparkling lake",
    "in a cozy village",
    "under the starry sky"
  ];
  
  const emotions = [
    "filled with friendship and joy",
    "full of wonder and discovery",
    "brimming with kindness and courage",
    "overflowing with laughter and fun",
    "rich with love and adventure"
  ];
  
  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
  const randomSetting = settings[Math.floor(Math.random() * settings.length)];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
  
  return `${randomEnhancement} ${prompt.toLowerCase()} ${randomSetting}, ${randomEmotion}.`;
};