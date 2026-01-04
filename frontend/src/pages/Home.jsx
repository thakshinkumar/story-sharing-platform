import { useState, useEffect } from 'react';
import { getAllStories } from '../utils/api';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, popular, recent
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStories();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchStories = async () => {
    try {
      const response = await getAllStories();
      setStories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setLoading(false);
    }
  };

  const getFilteredStories = () => {
    let filtered = [...stories];
    if (filter === 'popular') {
      filtered.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    } else if (filter === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-4">
          <span className="gradient-text">Share Your Stories</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover amazing stories from writers around the world
        </p>
        {user ? (
          <Link to="/create-story" className="btn-primary inline-block">
            ✍️ Write Your Story
          </Link>
        ) : (
          <Link to="/register" className="btn-primary inline-block">
            🚀 Get Started
          </Link>
        )}
      </div>

      {/* Show content only if user is logged in */}
      {!user ? (
        <div className="card p-12 text-center animate-fade-in">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Login to View Stories</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community to read, write, and share amazing stories
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Stories
            </button>
            <button
              onClick={() => setFilter('popular')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === 'popular'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔥 Popular
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === 'recent'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              ⚡ Recent
            </button>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 gap-6">
            {getFilteredStories().length > 0 ? (
              getFilteredStories().map((story) => (
                <StoryCard key={story._id} story={story} onUpdate={fetchStories} />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-600 mb-4">No stories yet</p>
                <Link to="/create-story" className="btn-primary inline-block">
                  Be the first to share a story! 🎉
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
