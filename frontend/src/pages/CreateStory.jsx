import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStory, calculateReadingTime } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CreateStory = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    if (content.trim().length < 50) {
      setError('Content must be at least 50 characters');
      return;
    }

    setLoading(true);

    try {
      await createStory({ title, content });
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create story');
      setLoading(false);
    }
  };

  const readingTime = content ? calculateReadingTime(content) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Write Your Story</h1>
          <p className="text-gray-600">Share your thoughts and creativity with the world</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Story Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="input-field"
              placeholder="Enter a captivating title..."
            />
            <p className="text-sm text-gray-500 mt-1">
              {title.length} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Story
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="15"
              className="input-field resize-none"
              placeholder="Once upon a time..."
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{content.length} characters</span>
              {readingTime > 0 && (
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{readingTime} min read</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : '📚 Publish Story'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;
