import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username avatar')
      .sort('-createdAt');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
      author: req.user.id,
      post: req.body.postId
    });
    
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username avatar');
    
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    comment.content = req.body.content;
    await comment.save();
    
    res.json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Not authorized' });
    }
    
    await comment.deleteOne();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};