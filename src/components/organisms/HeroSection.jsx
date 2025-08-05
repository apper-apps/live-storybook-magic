import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const HeroSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "PenTool",
      title: "AI-Powered Stories",
      description: "Create unique stories using advanced AI models"
    },
    {
      icon: "Image",
      title: "Beautiful Illustrations",
      description: "Get 10-12 custom illustrations for your story"
    },
    {
      icon: "Download",
      title: "PDF Download",
      description: "Download your complete book as a professional PDF"
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary-200 to-primary-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <motion.h1
                className="font-display text-5xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Create{" "}
                <span className="gradient-text">Magical</span>
                <br />
                Children's Books
              </motion.h1>
              
              <motion.p
                className="text-xl text-gray-600 leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Transform your imagination into beautifully illustrated children's books with the power of AI. 
                Just tell us your story idea, and we'll create a complete book with stunning artwork ready to download!
              </motion.p>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="xl"
                onClick={() => navigate("/create")}
                className="flex items-center justify-center space-x-3 pulse-glow"
              >
                <ApperIcon name="Wand2" className="w-6 h-6" />
                <span>Start Creating</span>
              </Button>
              
              <Button
                size="xl"
                variant="outline"
                onClick={() => navigate("/stories")}
                className="flex items-center justify-center space-x-3"
              >
                <ApperIcon name="BookOpen" className="w-6 h-6" />
                <span>View Examples</span>
              </Button>
            </motion.div>

            {/* Features List */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Sample Book Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative float">
              <Card className="page-curl book-cover p-8 text-white max-w-md mx-auto transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                    <ApperIcon name="Heart" className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-display text-2xl font-bold mb-2">
                      Luna's Moonlight Adventure
                    </h3>
                    <p className="text-white/80 text-sm">
                      A magical tale of friendship and discovery under the starry night sky
                    </p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-xs text-white/90 italic">
                      "Once upon a time, in a forest where the moonlight danced through the trees..."
                    </p>
                  </div>
                </div>
              </Card>

              {/* Floating Elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-secondary-400 rounded-full sparkle"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              
              <motion.div
                className="absolute -bottom-6 -right-6 w-6 h-6 bg-primary-400 rounded-full sparkle"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1 }}
              />
              
              <motion.div
                className="absolute top-1/2 -right-8 w-4 h-4 bg-yellow-400 rounded-full sparkle"
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </div>

            {/* Sample Pages Preview */}
            <div className="absolute -bottom-8 -left-8 w-48 h-32 bg-white rounded-lg shadow-lg opacity-80 transform -rotate-12">
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="w-full h-16 bg-gradient-to-r from-pink-200 to-purple-200 rounded"></div>
                <div className="space-y-1">
                  <div className="w-full h-1 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;