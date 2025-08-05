import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Create Story", path: "/create", icon: "PenTool" },
    { name: "My Stories", path: "/stories", icon: "BookOpen" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold gradient-text">
                StoryBook Magic
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.path)
                    ? "bg-primary-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </motion.button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-primary-50 transition-colors"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6 text-gray-600" 
            />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? "bg-primary-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-primary-50 hover:text-primary-600"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;