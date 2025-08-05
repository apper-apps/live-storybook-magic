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
      // Step 1: Initialize generation
      setCurrentStep("Connecting to AI model...");
      setGenerationProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Generate story text
      setCurrentStep("Writing your magical story...");
      setGenerationProgress(30);
      
      // Simulate story generation with the selected LLM
      const storyData = await simulateStoryGeneration(formData);
      
      // Step 3: Extract scenes for illustrations
      setCurrentStep("Identifying key scenes for illustrations...");
      setGenerationProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 4: Generate illustrations
      setCurrentStep("Creating beautiful illustrations...");
      setGenerationProgress(70);
      
      const illustrations = await simulateIllustrationGeneration(formData.illustrationCount, formData.illustrationStyle);
      
      // Step 5: Save to database
      setCurrentStep("Saving your story...");
      setGenerationProgress(90);
      
      const completeStory = {
        ...storyData,
        image_urls: illustrations.map(ill => ill.image_url),
        llm_used: formData.llmProvider,
        character_count: formData.characterCount,
        illustration_count: formData.illustrationCount,
        illustration_style: formData.illustrationStyle
      };

      const savedStory = await storiesService.create(completeStory);
      
      // Step 6: Complete
      setCurrentStep("Story created successfully!");
      setGenerationProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success("Your magical story has been created!");
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

  const simulateIllustrationGeneration = async (count, style) => {
    // This would be replaced with actual DALL-E API calls
    const illustrations = [];
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      illustrations.push({
        scene_number: i + 1,
        description: `Scene ${i + 1} description`,
        dalle_prompt: `A ${style} illustration for scene ${i + 1}`,
        image_url: `https://picsum.photos/400/300?random=${Date.now()}-${i}`,
        caption: `Illustration ${i + 1}`
      });
      
      // Update progress for illustration generation
      const illustrationProgress = 70 + (20 * (i + 1) / count);
      setGenerationProgress(illustrationProgress);
    }
    
    return illustrations;
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