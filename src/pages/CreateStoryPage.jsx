import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryGenerator from "@/components/organisms/StoryGenerator";
import StoryPreview from "@/components/organisms/StoryPreview";

const CreateStoryPage = () => {
  const [generatedStory, setGeneratedStory] = useState(null);
  const [illustrations, setIllustrations] = useState([]);
  const navigate = useNavigate();

  const handleStoryGenerated = (story, storyIllustrations) => {
    setGeneratedStory(story);
    setIllustrations(storyIllustrations);
  };

  const handleBackToCreate = () => {
    setGeneratedStory(null);
    setIllustrations([]);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {generatedStory ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToCreate}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <span>← Back to Create</span>
              </button>
              
              <button
                onClick={() => navigate("/stories")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
              >
                <span>View All Stories →</span>
              </button>
            </div>
            
            <StoryPreview 
              story={generatedStory} 
              illustrations={illustrations} 
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="font-display text-4xl font-bold gradient-text mb-4">
                Create Your Story
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Transform your imagination into a beautifully illustrated children's book. 
                Just tell us your story idea and we'll do the rest!
              </p>
            </div>
            
            <StoryGenerator onStoryGenerated={handleStoryGenerated} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStoryPage;