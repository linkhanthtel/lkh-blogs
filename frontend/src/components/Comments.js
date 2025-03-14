import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const { showLoading, hideLoading, showError } = useUI();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      showLoading();
      const response = await axios.get(`http://localhost:5001/api/comments/post/${postId}`);
      setComments(response.data);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to fetch comments');
    } finally {
      hideLoading();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      showLoading();
      const response = await axios.post('http://localhost:5001/api/comments', {
        content,
        postId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComments([response.data, ...comments]);
      setContent('');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to create comment');
    } finally {
      hideLoading();
    }
  };

  const handleDelete = async (commentId) => {
    try {
      showLoading();
      await axios.delete(`http://localhost:5001/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete comment');
    } finally {
      hideLoading();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      
      {user && (
        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Button type="submit" variant="contained" disabled={!content.trim()}>
            Post Comment
          </Button>
        </Box>
      )}

      {comments.map((comment) => (
        <Paper key={comment._id} sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar src={comment.author.avatar} sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              {comment.author.username}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 1 }}>
            {comment.content}
          </Typography>
          {user && user.id === comment.author._id && (
            <Button
              size="small"
              color="error"
              onClick={() => handleDelete(comment._id)}
            >
              Delete
            </Button>
          )}
        </Paper>
      ))}
    </Box>
  );
};

export default Comments;