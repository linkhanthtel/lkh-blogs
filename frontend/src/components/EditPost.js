import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { showLoading, hideLoading, showError } = useUI();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        showLoading();
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to fetch post');
        navigate('/');
      } finally {
        hideLoading();
      }
    };

    fetchPost();
  }, [id, navigate, showLoading, hideLoading, showError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      showLoading();
      await axios.put(`http://localhost:5000/api/posts/${id}`, {
        title,
        content
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/');
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to update post');
    } finally {
      hideLoading();
    }
  };

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Post
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Content"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Update Post
        </Button>
      </Box>
    </Container>
  );
};

export default EditPost;