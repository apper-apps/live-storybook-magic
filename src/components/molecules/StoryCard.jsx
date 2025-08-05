import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const StoryCard = ({ 
  story, 
  onView, 
  onDelete, 
  className = "" 
}) => {
  const previewImage = story.image_urls && story.image_urls.length > 0 
    ? story.image_urls[0] 
    : null;

  const createdDate = story.created_at ? format(new Date(story.created_at), "MMM d, yyyy") : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card hover className="h-full">
        <div className="relative">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Story preview"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-16 h-16 text-primary-400" />
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge variant="primary" size="sm">
              {story.llm_used || "AI Generated"}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {story.title || "My Story"}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {story.story_text ? story.story_text.substring(0, 120) + "..." : story.prompt}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <ApperIcon name="Type" className="w-4 h-4 mr-1" />
                {story.character_count || 800}
              </span>
              <span className="flex items-center">
                <ApperIcon name="Image" className="w-4 h-4 mr-1" />
                {story.illustration_count || story.image_urls?.length || 10}
              </span>
            </div>
            {createdDate && (
              <span className="flex items-center">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                {createdDate}
              </span>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={() => onView(story)}
              size="sm"
              className="flex-1"
            >
              <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
              View Story
            </Button>
            
            <Button
              onClick={() => onDelete(story.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StoryCard;