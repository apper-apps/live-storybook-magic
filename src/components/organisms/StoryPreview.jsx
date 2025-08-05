import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { generateStoryPDF, downloadPDF } from "@/utils/pdfGenerator";
import { toast } from "react-toastify";

const StoryPreview = ({ story, illustrations = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Split story into pages
  const storyParagraphs = story.story_text ? story.story_text.split("\n\n").filter(p => p.trim()) : [];
  const pages = storyParagraphs.map((paragraph, index) => ({
    text: paragraph,
    illustration: illustrations[index] || null
  }));

  // Add title page
  const titlePage = {
    isTitle: true,
    title: story.title || "My Magical Story",
    subtitle: "Created with StoryBook Magic"
  };

  const allPages = [titlePage, ...pages];
  const totalPages = allPages.length;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = await generateStoryPDF(
        story.story_text,
        illustrations,
        story.title || "My Magical Story"
      );
      downloadPDF(doc, `${story.title || "my-story"}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const currentPageData = allPages[currentPage];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Story Info Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold gradient-text mb-2">
              {story.title || "My Magical Story"}
            </h2>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <ApperIcon name="Type" className="w-4 h-4 mr-1" />
                {story.character_count || story.story_text?.length || 0} characters
              </span>
              <span className="flex items-center">
                <ApperIcon name="Image" className="w-4 h-4 mr-1" />
                {illustrations.length} illustrations
              </span>
              <span className="flex items-center">
                <ApperIcon name="Brain" className="w-4 h-4 mr-1" />
                {story.llm_used}
              </span>
            </div>
          </div>
          
          <Button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center space-x-2"
          >
            {isGeneratingPDF ? (
              <>
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <ApperIcon name="Download" className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Book Preview */}
      <div className="relative">
        <Card className="story-page min-h-[600px] p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {currentPageData?.isTitle ? (
                // Title Page
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-8">
                    <ApperIcon name="BookOpen" className="w-16 h-16 text-white" />
                  </div>
                  
                  <div>
                    <h1 className="font-display text-4xl font-bold gradient-text mb-4">
                      {currentPageData.title}
                    </h1>
                    <p className="text-xl text-gray-600">
                      {currentPageData.subtitle}
                    </p>
                  </div>

                  {story.prompt && (
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 max-w-md">
                      <p className="text-sm text-gray-700 italic">
                        "{story.prompt}"
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                // Story Page
                <div className="flex-1 space-y-6">
                  {/* Illustration */}
                  {currentPageData?.illustration && (
                    <div className="text-center">
                      <img
                        src={currentPageData.illustration.image_url}
                        alt={currentPageData.illustration.caption || "Story illustration"}
                        className="max-w-full h-64 object-contain mx-auto rounded-xl shadow-lg"
                      />
                      {currentPageData.illustration.caption && (
                        <p className="text-sm text-gray-600 mt-3 italic">
                          {currentPageData.illustration.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Story Text */}
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-800 leading-relaxed text-justify">
                      {currentPageData?.text}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </Card>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            variant="outline"
            size="sm"
            className="rounded-full w-12 h-12 p-0"
          >
            <ApperIcon name="ChevronLeft" className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4">
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            variant="outline"
            size="sm"
            className="rounded-full w-12 h-12 p-0"
          >
            <ApperIcon name="ChevronRight" className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Page Indicator */}
      <div className="flex items-center justify-center space-x-4">
        <div className="flex space-x-2">
          {allPages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentPage
                  ? "bg-primary-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
        
        <span className="text-sm text-gray-600 ml-4">
          Page {currentPage + 1} of {totalPages}
        </span>
      </div>

      {/* All Illustrations Grid */}
      {illustrations.length > 0 && (
        <Card className="p-6">
          <h3 className="font-display text-xl font-bold text-gray-900 mb-6 flex items-center">
            <ApperIcon name="Image" className="w-5 h-5 mr-2" />
            All Illustrations
          </h3>
          
          <div className="illustration-grid">
            {illustrations.map((illustration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl p-4 shadow-lg border border-gray-100"
              >
                <img
                  src={illustration.image_url}
                  alt={illustration.caption || `Illustration ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
                <p className="text-sm text-gray-600 text-center">
                  {illustration.caption || `Scene ${index + 1}`}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default StoryPreview;