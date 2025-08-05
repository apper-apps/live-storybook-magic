import React from "react";
import Error from "@/components/ui/Error";
let pipeline = null;
let isLoading = false;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 30000; // 30 seconds

// Fallback enhancement function
function fallbackEnhancement(prompt) {
  // Basic prompt enhancement using simple rules
  const enhancements = [
    'Create a vivid and engaging story about',
    'Tell an imaginative tale featuring', 
    'Craft a wonderful story that includes',
    'Write a captivating story about'
  ];
  
  const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
  return `${randomEnhancement} ${prompt}. Make it age-appropriate and full of wonder.`;
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