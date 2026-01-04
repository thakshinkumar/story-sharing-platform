import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoryById, addComment, deleteComment, likeStory, unlikeStory, addBookmark, removeBookmark, calculateReadingTime, deleteStory } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStory();
  }, [id, user]);

  const fetchStory = async () => {
    try {
      const response = await getStoryById(id);
      setStory(response.data);
      setIsLiked(response.data.likes?.includes(user?._id));
      setLikesCount(response.data.likes?.length || 0);
      setIsBookmarked(response.data.isBookmarked || false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching story:', error);
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }

    try {
      await addComment(id, commentText);
      setCommentText('');
      fetchStory();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      fetchStory();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like stories');
      return;
    }

    try {
      if (isLiked) {
        await unlikeStory(id);
        setLikesCount(prev => prev - 1);
      } else {
        await likeStory(id);
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      alert('Please login to bookmark stories');
      return;
    }

    try {
      if (isBookmarked) {
        await removeBookmark(id);
      } else {
        await addBookmark(id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(id);
        navigate('/');
      } catch (error) {
        console.error('Error deleting story:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-500"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Story not found</h2>
      </div>
    );
  }

  const readingTime = calculateReadingTime(story.content);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="card p-8 mb-8 animate-fade-in">
        {/* Story Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{story.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {story.author?.username?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{story.author?.username || 'Anonymous'}</p>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <span>{new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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

            {user && story.author?._id === user._id && (
              <button
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                Delete
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-6 py-4 border-y border-gray-200">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
              }`}
            >
              <svg className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="font-semibold">{likesCount}</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">{story.comments?.length || 0}</span>
            </div>

            <button
              onClick={handleBookmark}
              className={`flex items-center space-x-2 transition-all duration-200 ${
                isBookmarked ? 'text-primary-600' : 'text-gray-600 hover:text-primary-600'
              }`}
            >
              <svg className={`w-7 h-7 ${isBookmarked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="font-semibold">{isBookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{story.content}</p>
        </div>
      </article>

      {/* Comments Section */}
      <div className="card p-8 animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({story.comments?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              rows="3"
              className="input-field mb-3"
              required
            />
            <button type="submit" className="btn-primary">
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-600 mb-8">Please login to comment</p>
        )}

        <div className="space-y-6">
          {story.comments?.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {comment.author?.username?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{comment.author?.username || 'Anonymous'}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {user && comment.author?._id === user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-800 ml-13">{comment.content}</p>
            </div>
          ))}

          {(!story.comments || story.comments.length === 0) && (
            <p className="text-center text-gray-600 py-8">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryDetail;
