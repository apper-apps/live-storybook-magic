import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StoryCard from "@/components/molecules/StoryCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { storiesService } from "@/services/api/storiesService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const StoryGallery = ({ onViewStory }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    setError("");
    
    try {
      const storiesData = await storiesService.getAll();
      setStories(storiesData);
    } catch (err) {
      console.error("Error loading stories:", err);
      setError("Failed to load stories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm("Are you sure you want to delete this story?")) {
      return;
    }

    try {
      await storiesService.delete(storyId);
      setStories(prev => prev.filter(story => story.Id !== storyId));
      toast.success("Story deleted successfully");
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story");
    }
  };

  const handleRetry = () => {
    loadStories();
  };

  const getSortedStories = () => {
    let sortedStories = [...stories];
    
    switch (sortBy) {
      case "newest":
        sortedStories.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        sortedStories.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "title":
        sortedStories.sort((a, b) => (a.title || a.prompt).localeCompare(b.title || b.prompt));
        break;
      default:
        break;
    }
    
    return sortedStories;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={handleRetry} />;
  }

  if (stories.length === 0) {
    return <Empty />;
  }

  const sortedStories = getSortedStories();

  return (
    <div className="space-y-6">
      {/* Header with Sort Options */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold gradient-text">
            My Story Collection
          </h2>
          <p className="text-gray-600 mt-1">
            {stories.length} {stories.length === 1 ? "story" : "stories"} created
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">By Title</option>
            </select>
          </div>

          <Button
            onClick={loadStories}
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2"
          >
            <ApperIcon name="RefreshCw" className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {sortedStories.map((story, index) => (
            <motion.div
              key={story.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StoryCard
                story={story}
                onView={() => onViewStory(story)}
                onDelete={() => handleDeleteStory(story.Id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button (for future pagination) */}
      {stories.length >= 12 && (
        <div className="flex justify-center pt-8">
          <Button variant="outline" size="lg">
            Load More Stories
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoryGallery;