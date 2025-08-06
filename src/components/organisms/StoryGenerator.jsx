import React, { useState } from "react";
import { motion } from "framer-motion";
import StoryForm from "@/components/organisms/StoryForm";
import ProgressBar from "@/components/molecules/ProgressBar";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { storiesService } from "@/services/api/storiesService";
import { toast } from "react-toastify";

const StoryGenerator = ({ onStoryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

const generateStory = async (formData) => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentStep("Preparing to create your story...");

    try {
      // Step 1: Initialize generation with enhanced prompt processing
      setCurrentStep("Analyzing your story goals...");
      setGenerationProgress(5);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Determine the best prompt to use for background processing
      const finalPrompt = formData.enhancedPrompt && formData.enhancedPrompt.trim() 
        ? formData.enhancedPrompt 
        : formData.prompt;

      // Step 2: Connect to AI model
      setCurrentStep("Connecting to AI model...");
      setGenerationProgress(15);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Generate story text with enhanced prompt processing
      setCurrentStep("Writing your magical story with enhanced creativity...");
      setGenerationProgress(35);
      
      // Pass both original and enhanced prompts for better context
      const storyData = await simulateStoryGeneration({
        ...formData,
        finalPrompt,
        hasEnhancedPrompt: !!formData.enhancedPrompt
      });
      
      // Step 4: Extract scenes for illustrations
      setCurrentStep("Identifying key scenes for illustrations...");
      setGenerationProgress(55);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 5: Generate contextual illustrations
      setCurrentStep("Creating beautiful illustrations that match your story...");
      setGenerationProgress(75);
      
      const illustrations = await simulateIllustrationGeneration(
        formData.illustrationCount, 
        formData.illustrationStyle,
        storyData.story_text,
        finalPrompt
      );
      
      // Step 6: Save to database
      setCurrentStep("Saving your story...");
      setGenerationProgress(90);
      
      const completeStory = {
        ...storyData,
        enhanced_prompt: formData.enhancedPrompt || null,
        image_urls: illustrations.map(ill => ill.image_url),
        llm_used: formData.llmProvider,
        character_count: formData.characterCount,
        illustration_count: formData.illustrationCount,
        illustration_style: formData.illustrationStyle
      };

      const savedStory = await storiesService.create(completeStory);
      
      // Step 7: Complete
      setCurrentStep("Story created successfully!");
      setGenerationProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success("Your magical story has been created with enhanced creativity!");
      onStoryGenerated(savedStory, illustrations);

    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Failed to generate story. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep("");
    }
  };

  // Simulate story generation (replace with actual API calls)
  const simulateStoryGeneration = async (formData) => {
    // This would be replaced with actual API calls to the selected LLM
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      prompt: formData.prompt,
      enhanced_prompt: formData.enhancedPrompt || formData.prompt,
      title: generateTitleFromPrompt(formData.prompt),
      story_text: generateSampleStory(formData.prompt, formData.characterCount)
    };
  };

const simulateIllustrationGeneration = async (count, style, storyText = '', prompt = '') => {
    // This would be replaced with actual DALL-E API calls
    const illustrations = [];
    
    // Extract story elements for more contextual illustrations
    const combinedText = `${storyText} ${prompt}`.toLowerCase();
    const storyElements = {
      characters: extractStoryCharacters(combinedText),
      settings: extractStorySettings(combinedText),
      mood: extractStoryMood(combinedText)
    };
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create contextual scene descriptions based on story content
      const sceneContext = generateSceneDescription(storyElements, i, style);
      
      illustrations.push({
        scene_number: i + 1,
        description: sceneContext.description,
        dalle_prompt: `A ${style} illustration showing ${sceneContext.prompt}`,
        image_url: `https://picsum.photos/400/300?random=${sceneContext.seed}&style=${style}`,
        caption: sceneContext.caption
      });
      
      // Update progress for illustration generation
      const illustrationProgress = 75 + (15 * (i + 1) / count);
      setGenerationProgress(illustrationProgress);
    }
    
    return illustrations;
  };

  // Helper functions for contextual illustration generation
  const extractStoryCharacters = (text) => {
    const characters = ['bunny', 'dragon', 'princess', 'knight', 'cat', 'dog', 'bird', 'fox'];
    return characters.find(char => text.includes(char)) || 'character';
  };

  const extractStorySettings = (text) => {
    const settings = ['forest', 'castle', 'garden', 'ocean', 'mountain', 'village', 'magical'];
    return settings.find(setting => text.includes(setting)) || 'enchanted land';
  };

  const extractStoryMood = (text) => {
    if (text.includes('adventure')) return 'adventurous';
    if (text.includes('peaceful')) return 'peaceful';
    if (text.includes('magical')) return 'magical';
    return 'whimsical';
  };

  const generateSceneDescription = (elements, sceneIndex, style) => {
    const { characters, settings, mood } = elements;
    
    const sceneTypes = [
      { 
        description: `${characters} in ${settings}`, 
        prompt: `${characters} exploring a ${mood} ${settings}`,
        caption: `Our hero begins the journey in ${settings}`
      },
      { 
        description: `${characters} discovers something special`, 
        prompt: `${characters} finding a magical discovery in ${settings}`,
        caption: `A wonderful discovery awaits`
      },
      { 
        description: `${characters} faces a challenge`, 
        prompt: `${characters} overcoming obstacles with courage in ${settings}`,
        caption: `Facing challenges with bravery`
      },
      { 
        description: `${characters} makes friends`, 
        prompt: `${characters} meeting new friends in a ${mood} scene`,
        caption: `New friendships bloom`
      },
      { 
        description: `${characters} learns something important`, 
        prompt: `${characters} having a moment of understanding and growth`,
        caption: `An important lesson is learned`
      },
      { 
        description: `${characters} celebrates success`, 
        prompt: `${characters} celebrating triumph in ${settings}`,
        caption: `Celebrating the victory`
      }
    ];
    
    const scene = sceneTypes[sceneIndex % sceneTypes.length];
    return {
      ...scene,
      seed: `${characters}_${settings}_${sceneIndex}_${Date.now()}`
    };
  };

  const generateTitleFromPrompt = (prompt) => {
    const words = prompt.split(" ");
    const keyWords = words.slice(0, 4).join(" ");
    return `The Story of ${keyWords}`;
  };

  const generateSampleStory = (prompt, characterCount) => {
    // Generate a sample story based on the prompt
    const baseStory = `Once upon a time, there was a magical adventure that began with ${prompt.toLowerCase()}. 

The story unfolded in a wonderful land where anything was possible. Our brave characters embarked on an incredible journey filled with friendship, discovery, and wonder.

Through challenges and triumphs, they learned valuable lessons about courage, kindness, and the power of believing in themselves.

As the sun set on their adventure, they knew that this was just the beginning of many more magical stories to come.

And they all lived happily ever after, with hearts full of joy and memories that would last forever.`;

    // Adjust length to match requested character count
    if (baseStory.length < characterCount) {
      const additionalText = " The adventure continued with even more exciting discoveries and heartwarming moments that brought everyone closer together.";
      return baseStory + additionalText.repeat(Math.ceil((characterCount - baseStory.length) / additionalText.length));
    }
    
    return baseStory.substring(0, characterCount);
  };

  if (isGenerating) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto"
            >
              <ApperIcon name="Wand2" className="w-8 h-8 text-white" />
            </motion.div>

            <div>
              <h2 className="font-display text-2xl font-bold gradient-text mb-2">
                Creating Your Story
              </h2>
              <p className="text-gray-600">
                Please wait while we work our magic...
              </p>
            </div>

            <ProgressBar
              progress={generationProgress}
              label={currentStep}
              className="max-w-md mx-auto"
            />

            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <ApperIcon name="PenTool" className="w-4 h-4" />
                <span>Writing story</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Image" className="w-4 h-4" />
                <span>Creating illustrations</span>
              </div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Save" className="w-4 h-4" />
                <span>Saving book</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <StoryForm onSubmit={generateStory} isLoading={isGenerating} />;
};

export default StoryGenerator;