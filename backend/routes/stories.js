import express from 'express';
import Story from '../models/Story.js';
import Bookmark from '../models/Bookmark.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all stories (requires authentication)
router.get('/', authenticate, async (req, res) => {
  try {
    const stories = await Story.find()
      .populate('author', 'username email')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    
    // Check which stories are bookmarked by the current user
    const bookmarks = await Bookmark.find({ user: req.userId });
    const bookmarkedStoryIds = bookmarks.map(b => b.story.toString());
    
    const storiesWithBookmarks = stories.map(story => {
      const storyObj = story.toObject();
      storyObj.isBookmarked = bookmarkedStoryIds.includes(story._id.toString());
      return storyObj;
    });
    
    res.json(storiesWithBookmarks);
  } catch (error) {
    console.error('Error fetching stories:', error);
    res.status(500).json({ message: 'Error fetching stories' });
  }
});

// Get story by ID (requires authentication)
router.get('/:id', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'username email')
      .populate('comments.author', 'username');
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if bookmarked by current user
    const bookmark = await Bookmark.findOne({ user: req.userId, story: story._id });
    const storyObj = story.toObject();
    storyObj.isBookmarked = !!bookmark;
    
    res.json(storyObj);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ message: 'Error fetching story' });
  }
});

// Get user's stories
router.get('/user/me', authenticate, async (req, res) => {
  try {
    const stories = await Story.find({ author: req.userId })
      .populate('author', 'username email')
      .populate('comments.author', 'username')
      .sort({ createdAt: -1 });
    
    res.json(stories);
  } catch (error) {
    console.error('Error fetching user stories:', error);
    res.status(500).json({ message: 'Error fetching your stories' });
  }
});

// Create story
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    if (title.length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters' });
    }

    if (content.length < 50) {
      return res.status(400).json({ message: 'Content must be at least 50 characters' });
    }

    const story = new Story({
      title,
      content,
      author: req.userId
    });

    await story.save();
    await story.populate('author', 'username email');

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Error creating story' });
  }
});

// Update story
router.put('/:id', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this story' });
    }

    const { title, content } = req.body;
    if (title) story.title = title;
    if (content) story.content = content;

    await story.save();
    await story.populate('author', 'username email');

    res.json(story);
  } catch (error) {
    console.error('Error updating story:', error);
    res.status(500).json({ message: 'Error updating story' });
  }
});

// Delete story
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this story' });
    }

    await Story.findByIdAndDelete(req.params.id);
    await Bookmark.deleteMany({ story: req.params.id });

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ message: 'Error deleting story' });
  }
});

// Like story
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Already liked' });
    }

    story.likes.push(req.userId);
    await story.save();

    res.json({ message: 'Story liked', likes: story.likes.length });
  } catch (error) {
    console.error('Error liking story:', error);
    res.status(500).json({ message: 'Error liking story' });
  }
});

// Unlike story
router.delete('/:id/like', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.likes = story.likes.filter(id => id.toString() !== req.userId.toString());
    await story.save();

    res.json({ message: 'Story unliked', likes: story.likes.length });
  } catch (error) {
    console.error('Error unliking story:', error);
    res.status(500).json({ message: 'Error unliking story' });
  }
});

// Add comment
router.post('/:id/comments', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.comments.push({
      content,
      author: req.userId
    });

    await story.save();
    await story.populate('comments.author', 'username');

    res.status(201).json(story.comments[story.comments.length - 1]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Delete comment
router.delete('/:storyId/comments/:commentId', authenticate, async (req, res) => {
  try {
    const story = await Story.findById(req.params.storyId);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const comment = story.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    story.comments.pull(req.params.commentId);
    await story.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

export default router;
