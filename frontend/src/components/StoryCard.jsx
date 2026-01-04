import { Link } from 'react-router-dom';
import { useState } from 'react';
import { likeStory, unlikeStory, addBookmark, removeBookmark, calculateReadingTime } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StoryCard = ({ story, onUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(story.likes?.includes(user?._id));
  const [likesCount, setLikesCount] = useState(story.likes?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(story.isBookmarked || false);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to like stories');
      return;
    }

    try {
      if (isLiked) {
        await unlikeStory(story._id);
        setLikesCount(prev => prev - 1);
      } else {
        await likeStory(story._id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to bookmark stories');
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(story._id);
      } else {
        await addBookmark(story._id);
      }
      setIsBookmarked(!isBookmarked);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const readingTime = calculateReadingTime(story.content);

  return (
    <Link to={`/story/${story._id}`} className="block">
      <div className="card p-6 mb-6 animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 hover:text-primary-600 transition-colors mb-2">
              {story.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {story.author?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="font-medium">{story.author?.username || 'Anonymous'}</span>
              </div>
              <span>•</span>
              <span>{new Date(story.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readingTime} min read</span>
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {story.content.substring(0, 200)}...
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-semibold">{likesCount}</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">{story.comments?.length || 0}</span>
            </div>
          </div>

          <button
            onClick={handleBookmark}
            className={`transition-all duration-200 ${
              isBookmarked ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            <svg className={`w-6 h-6 ${isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
