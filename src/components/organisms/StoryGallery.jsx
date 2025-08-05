import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StoryCard from '@/components/molecules/StoryCard';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { storiesService } from '@/services/api/storiesService';
import { toast } from 'react-toastify';

const StoryGallery = ({ onViewStory }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStories, setFilteredStories] = useState([]);

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchStories(searchQuery);
    } else {
      setFilteredStories(stories);
    }
  }, [searchQuery, stories]);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedStories = await storiesService.getAll();
      setStories(fetchedStories);
      setFilteredStories(fetchedStories);
    } catch (err) {
      setError('Failed to load stories');
      console.error('Error loading stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const searchStories = async (query) => {
    try {
      if (query.trim()) {
        const results = await storiesService.searchStories(query);
        setFilteredStories(results);
      } else {
        setFilteredStories(stories);
      }
    } catch (err) {
      console.error('Error searching stories:', err);
      setFilteredStories(stories);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      try {
        const success = await storiesService.delete(storyId);
        if (success) {
          // Remove from local state
          setStories(prev => prev.filter(story => story.Id !== storyId));
          setFilteredStories(prev => prev.filter(story => story.Id !== storyId));
        }
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  if (loading) {
    return <Loading message="Loading your magical stories..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadStories} />;
  }

  if (stories.length === 0) {
    return (
      <Empty 
        icon="BookOpen"
        title="No Stories Yet"
        description="Start creating your first magical children's book!"
        actionLabel="Create Your First Story"
        onAction={() => window.location.href = '/create'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search your stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <ApperIcon 
            name="Search" 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
          />
        </div>
      </div>

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <Empty 
          icon="Search"
          title="No Stories Found"
          description={`No stories found matching "${searchQuery}"`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredStories.map((story, index) => (
            <motion.div
              key={story.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StoryCard
                story={story}
                onView={() => onViewStory(story)}
                onDelete={() => handleDeleteStory(story.Id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Stats */}
      <div className="mt-8 text-center text-gray-600">
        <p>
          {filteredStories.length === stories.length 
            ? `${stories.length} ${stories.length === 1 ? 'story' : 'stories'} total`
            : `Showing ${filteredStories.length} of ${stories.length} stories`
          }
        </p>
      </div>
    </div>
  );
};

export default StoryGallery;