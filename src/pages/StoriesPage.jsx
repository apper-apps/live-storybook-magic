import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryGallery from "@/components/organisms/StoryGallery";
import StoryPreview from "@/components/organisms/StoryPreview";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StoriesPage = () => {
  const [selectedStory, setSelectedStory] = useState(null);
  const navigate = useNavigate();

  const handleViewStory = (story) => {
    setSelectedStory(story);
  };

  const handleBackToGallery = () => {
    setSelectedStory(null);
  };

  const mockIllustrations = [
    {
      scene_number: 1,
      description: "Story scene 1",
      dalle_prompt: "Cartoon illustration",
      image_url: "https://picsum.photos/400/300?random=1",
      caption: "The beginning of the adventure"
    },
    {
      scene_number: 2,
      description: "Story scene 2", 
      dalle_prompt: "Cartoon illustration",
      image_url: "https://picsum.photos/400/300?random=2",
      caption: "Meeting new friends"
    }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {selectedStory ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToGallery}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                <span>Back to Gallery</span>
              </button>
              
              <Button
                onClick={() => navigate("/create")}
                variant="secondary"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Create New Story</span>
              </Button>
            </div>
            
            <StoryPreview 
              story={selectedStory} 
              illustrations={mockIllustrations} 
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-4xl font-bold gradient-text mb-4">
                  My Stories
                </h1>
                <p className="text-xl text-gray-600">
                  Explore your collection of magical children's books
                </p>
              </div>
              
              <Button
                onClick={() => navigate("/create")}
                size="lg"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                <span>Create New Story</span>
              </Button>
            </div>
            
            <StoryGallery onViewStory={handleViewStory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;