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
    setCurrentStep("Preparing to create your magical story...");

    try {
      // Step 1: Storybook Magic initialization with age-appropriate processing
      setCurrentStep(`Analyzing story for ages ${formData.target_age_group}...`);
      setGenerationProgress(5);
      await new Promise(resolve => setTimeout(resolve, 800));

      // Determine the best prompt to use for character-consistent processing
      const finalPrompt = formData.enhancedPrompt && formData.enhancedPrompt.trim() 
        ? formData.enhancedPrompt 
        : formData.prompt;

      // Step 2: Connect to AI model
      setCurrentStep("Connecting to AI model...");
      setGenerationProgress(15);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Generate age-appropriate story with character development
      setCurrentStep(`Creating story for ${formData.target_age_group} year olds...`);
      setGenerationProgress(35);
      
      // Pass age group and character info for appropriate content generation
      const storyData = await simulateStoryGeneration({
        ...formData,
        finalPrompt,
        hasEnhancedPrompt: !!formData.enhancedPrompt,
        target_age_group: formData.target_age_group,
        character_name: formData.character_name
      });
      
      // Step 4: Extract story elements for character consistency
      setCurrentStep("Developing character consistency across illustrations...");
      setGenerationProgress(55);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Step 5: Generate character-consistent illustrations
      setCurrentStep("Creating illustrations with consistent character appearance...");
      setGenerationProgress(75);
      
      const illustrations = await simulateIllustrationGeneration(
        formData.illustrationCount, 
        formData.illustrationStyle,
        storyData.story_text,
        finalPrompt,
        formData.target_age_group,
        formData.character_name
      );
      
      // Step 6: Save complete Storybook Magic data
      setCurrentStep("Saving your personalized storybook...");
      setGenerationProgress(90);
      
      const completeStory = {
        ...storyData,
        enhanced_prompt: formData.enhancedPrompt || null,
        image_urls: illustrations.map(ill => ill.image_url),
        llm_used: formData.llmProvider,
        character_count: formData.characterCount,
        illustration_count: formData.illustrationCount,
        illustration_style: formData.illustrationStyle,
        target_age_group: formData.target_age_group,
        character_name: storyData.character_name, // Use generated or provided name
        character_appearance: storyData.character_appearance,
        character_personality: storyData.character_personality
      };

      const savedStory = await storiesService.create(completeStory);
      
      // Step 7: Complete
      setCurrentStep("Storybook Magic complete!");
      setGenerationProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success(`Your magical ${formData.target_age_group} story has been created with consistent character illustrations!`);
      onStoryGenerated(savedStory, illustrations);

    } catch (error) {
      console.error("Error generating story:", error);
      toast.error("Failed to generate story. Please check your settings and try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep("");
    }
  };

  // Simulate story generation (replace with actual API calls)
const simulateStoryGeneration = async (formData) => {
    // Storybook Magic: Generate age-appropriate story with character consistency
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const storyElements = storiesService.extractStoryElements(
      null, 
      formData.finalPrompt, 
      formData.enhancedPrompt,
      formData.target_age_group,
      formData.character_name
    );
    
    return {
      prompt: formData.prompt,
      enhanced_prompt: formData.enhancedPrompt || formData.prompt,
      title: generateTitleFromPrompt(formData.finalPrompt, storyElements.mainCharacter),
      story_text: generateAgeAppropriateStory(formData.finalPrompt, formData.characterCount, formData.target_age_group, storyElements.mainCharacter),
      character_name: storyElements.mainCharacter,
      character_appearance: storyElements.characterAppearance,
      character_personality: storyElements.characterPersonality
    };
  };

const simulateIllustrationGeneration = async (count, style, storyText = '', prompt = '', ageGroup = '1-2', characterName = null) => {
    // Storybook Magic: Generate consistent character illustrations
    const illustrations = [];
    
    // Extract comprehensive story elements for character consistency
    const storyElements = storiesService.extractStoryElements(storyText, prompt, null, ageGroup, characterName);
    
    for (let i = 0; i < count; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate age-appropriate scene context with consistent character
      const sceneContext = storiesService.generateSceneContext(storyElements, i, style, ageGroup);
      
      illustrations.push({
        scene_number: i + 1,
        description: sceneContext.description,
        dalle_prompt: sceneContext.prompt,
        image_url: `https://picsum.photos/400/300?random=${sceneContext.seed}&character=${characterName}&age=${ageGroup}`,
        caption: sceneContext.caption,
        character_context: sceneContext.context
      });
      
      // Update progress for illustration generation
      const illustrationProgress = 75 + (15 * (i + 1) / count);
      setGenerationProgress(illustrationProgress);
    }
    
    return illustrations;
  };

  // Helper functions for contextual illustration generation
const extractStoryCharacters = (text) => {
    const characters = ['bunny', 'dragon', 'princess', 'knight', 'cat', 'dog', 'bird', 'fox', 'puppy', 'kitten'];
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
// Storybook Magic: Age-appropriate scene generation with character consistency
    const ageAppropriateScenes = {
      '1-2': [
        { 
          description: `${characters} waking up happily`, 
          prompt: `${characters} with consistent appearance waking up in a cozy ${settings}, ${mood} mood, simple shapes, soft colors`,
          caption: `${characters} starts the day`
        },
        { 
          description: `${characters} exploring safely`, 
          prompt: `${characters} with same character design exploring a safe ${settings}, gentle ${mood} atmosphere`,
          caption: `Gentle exploration begins`
        },
        { 
          description: `${characters} making a friend`, 
          prompt: `${characters} meeting a friendly character in ${settings}, warm and ${mood}`,
          caption: `A new friend appears`
        },
        { 
          description: `${characters} playing happily`, 
          prompt: `${characters} playing safely in ${settings}, ${mood} and joyful`,
          caption: `Playtime is fun`
        },
        { 
          description: `${characters} resting peacefully`, 
          prompt: `${characters} resting contentedly in ${settings}, calm and peaceful`,
          caption: `Time to rest`
        }
      ],
      '3-5': [
        { 
          description: `${characters} beginning an adventure`, 
          prompt: `${characters} with consistent character design starting an adventure in ${settings}, ${mood} and excited`,
          caption: `The adventure begins`
        },
        { 
          description: `${characters} discovering something wonderful`, 
          prompt: `${characters} finding something magical in ${settings}, sense of wonder and ${mood}`,
          caption: `A magical discovery`
        },
        { 
          description: `${characters} helping others`, 
          prompt: `${characters} helping friends in ${settings}, kind and ${mood}`,
          caption: `Helping friends together`
        },
        { 
          description: `${characters} solving a problem`, 
          prompt: `${characters} thinking and solving a challenge in ${settings}, determined and ${mood}`,
          caption: `Problems can be solved`
        },
        { 
          description: `${characters} celebrating success`, 
          prompt: `${characters} celebrating with friends in ${settings}, happy and ${mood}`,
          caption: `Success feels wonderful`
        }
      ]
    };

    const scenes = ageAppropriateScenes['1-2'] || ageAppropriateScenes['1-2']; // Default to toddler-appropriate
    const scene = scenes[sceneIndex % scenes.length];
    
    return {
      ...scene,
      seed: `${characters}_${settings}_${sceneIndex}_${Date.now()}`
    };
  };

const generateTitleFromPrompt = (prompt, characterName) => {
    const character = characterName || 'Our Friend';
    const words = prompt.split(" ");
    const keyWords = words.slice(0, 3).join(" ");
    return `${character}'s ${keyWords} Adventure`;
  };
const generateAgeAppropriateStory = (prompt, characterCount, ageGroup, characterName) => {
    const character = characterName || 'our friend';
    
    const ageStoryTemplates = {
      '1-2': `Once upon a time, there was ${character}. ${character} lived in a happy place. 

${character} liked to ${prompt.toLowerCase()}. Every day was full of wonder and joy.

${character} made friends and played safely. When ${character} felt tired, it was time to rest.

${character} was loved and happy. The end.`,

      '3-5': `Once upon a time, there was a wonderful ${character} who loved to ${prompt.toLowerCase()}.

${character} went on a gentle adventure and met friendly characters along the way. Together, they explored and discovered amazing things.

When ${character} faced a small problem, friends helped solve it with kindness and creativity.

${character} learned that friendship, courage, and kindness make every day special. And they all lived happily ever after!`,

      '6-8': `In a magical land, there lived ${character}, who had a special dream to ${prompt.toLowerCase()}.

${character} embarked on an exciting journey filled with wonderful discoveries and new friendships. Along the way, ${character} learned important lessons about bravery, kindness, and helping others.

Through challenges and victories, ${character} grew wiser and more confident, knowing that with determination and friendship, anything is possible.

The adventure showed ${character} that the greatest magic comes from believing in yourself and caring for others.`
    };

    let baseStory = ageStoryTemplates[ageGroup] || ageStoryTemplates['1-2'];

    // Adjust length to match requested character count
    if (baseStory.length < characterCount) {
      const additionalText = ageGroup === '1-2' 
        ? ` ${character} played more and felt happy.`
        : ` The adventure continued with more wonderful moments of friendship and discovery.`;
      const repeat = Math.ceil((characterCount - baseStory.length) / additionalText.length);
      baseStory += additionalText.repeat(repeat);
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