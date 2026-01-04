import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserStories } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStories: 0, totalLikes: 0, totalComments: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchUserStories();
  }, [user]);

  const fetchUserStories = async () => {
    try {
      const response = await getUserStories();
      setStories(response.data);
      
      // Calculate stats
      const totalLikes = response.data.reduce((sum, story) => sum + (story.likes?.length || 0), 0);
      const totalComments = response.data.reduce((sum, story) => sum + (story.comments?.length || 0), 0);
      
      setStats({
        totalStories: response.data.length,
        totalLikes,
        totalComments,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user stories:', error);
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
      {/* Profile Header */}
      <div className="card p-8 mb-8 animate-fade-in">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-4xl">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-primary-600 mb-2">{stats.totalStories}</p>
            <p className="text-gray-700 font-semibold">Stories Published</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-red-600 mb-2">{stats.totalLikes}</p>
            <p className="text-gray-700 font-semibold">Total Likes</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
            <p className="text-4xl font-bold text-purple-600 mb-2">{stats.totalComments}</p>
            <p className="text-gray-700 font-semibold">Total Comments</p>
          </div>
        </div>
      </div>

      {/* User Stories */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Stories</h2>
        
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} onUpdate={fetchUserStories} />
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <p className="text-2xl text-gray-600 mb-4">You haven't published any stories yet</p>
            <button
              onClick={() => navigate('/create-story')}
              className="btn-primary"
            >
              Write Your First Story ✍️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
