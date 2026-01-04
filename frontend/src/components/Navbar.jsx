import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl">📚</span>
              <span className="text-2xl font-bold gradient-text">StoryShare</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors duration-200">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/create-story" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors duration-200">
                  Write Story
                </Link>
                <Link to="/bookmarks" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors duration-200">
                  Bookmarks
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors duration-200">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
                <div className="flex items-center space-x-2 pl-3 border-l-2 border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <Link to="/" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/create-story" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                  Write Story
                </Link>
                <Link to="/bookmarks" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                  Bookmarks
                </Link>
                <Link to="/profile" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 hover:text-red-700 px-3 py-2 rounded-md font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                  Login
                </Link>
                <Link to="/register" className="block text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
