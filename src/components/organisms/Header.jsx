import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '@/App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Header = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const { logout } = useContext(AuthContext);

  const navigation = [
    { name: 'Home', href: '/', icon: 'Home' },
    { name: 'Create Story', href: '/create', icon: 'Plus' },
    { name: 'My Stories', href: '/stories', icon: 'BookOpen' },
    { name: 'Settings', href: '/settings', icon: 'Settings' },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-display gradient-text">
                StoryBook Magic
              </h1>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user.emailAddress}</p>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <ApperIcon name="LogOut" className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;