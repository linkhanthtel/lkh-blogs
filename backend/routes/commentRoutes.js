import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();

router.get('/post/:postId', getComments);
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;