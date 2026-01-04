import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Stories
export const getAllStories = () => axios.get(`${API_URL}/api/stories`);
export const getStoryById = (id) => axios.get(`${API_URL}/api/stories/${id}`);
export const createStory = (storyData) => axios.post(`${API_URL}/api/stories`, storyData);
export const updateStory = (id, storyData) => axios.put(`${API_URL}/api/stories/${id}`, storyData);
export const deleteStory = (id) => axios.delete(`${API_URL}/api/stories/${id}`);

// Likes
export const likeStory = (id) => axios.post(`${API_URL}/api/stories/${id}/like`);
export const unlikeStory = (id) => axios.delete(`${API_URL}/api/stories/${id}/like`);

// Comments
export const getComments = (storyId) => axios.get(`${API_URL}/api/stories/${storyId}/comments`);
export const addComment = (storyId, content) => axios.post(`${API_URL}/api/stories/${storyId}/comments`, { content });
export const deleteComment = (storyId, commentId) => axios.delete(`${API_URL}/api/stories/${storyId}/comments/${commentId}`);

// Bookmarks
export const getBookmarks = () => axios.get(`${API_URL}/api/bookmarks`);
export const addBookmark = (storyId) => axios.post(`${API_URL}/api/bookmarks/${storyId}`);
export const removeBookmark = (storyId) => axios.delete(`${API_URL}/api/bookmarks/${storyId}`);

// User
export const getUserStories = () => axios.get(`${API_URL}/api/stories/user/me`);

// Utility function to calculate reading time
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};
