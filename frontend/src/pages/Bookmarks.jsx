import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookmarks } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';

const Bookmarks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [user]);

  const fetchBookmarks = async () => {
    try {
      const response = await getBookmarks();
      setBookmarks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setLoading(false);
    }
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
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-bold gradient-text mb-2">Your Bookmarks</h1>
        <p className="text-gray-600">Stories you've saved for later</p>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {bookmarks.map((bookmark) => (
            <StoryCard 
              key={bookmark._id} 
              story={{ ...bookmark.story, isBookmarked: true }} 
              onUpdate={fetchBookmarks} 
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center animate-fade-in">
          <div className="text-6xl mb-4">🔖</div>
          <p className="text-2xl text-gray-600 mb-4">No bookmarks yet</p>
          <p className="text-gray-500 mb-6">Start saving stories you'd like to read later</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Discover Stories
          </button>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
