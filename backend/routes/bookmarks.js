import express from 'express';
import Bookmark from '../models/Bookmark.js';
import Story from '../models/Story.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user's bookmarks
router.get('/', authenticate, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.userId })
      .populate({
        path: 'story',
        populate: [
          { path: 'author', select: 'username email' },
          { path: 'comments.author', select: 'username' }
        ]
      })
      .sort({ createdAt: -1 });
    
    res.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({ message: 'Error fetching bookmarks' });
  }
});

// Add bookmark
router.post('/:storyId', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.userId,
      story: req.params.storyId
    });

    if (existingBookmark) {
      return res.status(400).json({ message: 'Story already bookmarked' });
    }

    const bookmark = new Bookmark({
      user: req.userId,
      story: req.params.storyId
    });

    await bookmark.save();

    res.status(201).json({ message: 'Story bookmarked successfully' });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({ message: 'Error adding bookmark' });
  }
});

// Remove bookmark
router.delete('/:storyId', authenticate, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      user: req.userId,
      story: req.params.storyId
    });

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }

    res.json({ message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({ message: 'Error removing bookmark' });
  }
});

export default router;
