import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardActions, Typography, Button, Grid, 
  Container, Box, Divider, CardHeader, Avatar, IconButton 
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showLoading, hideLoading, showError } = useUI();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        showLoading();
        const response = await axios.get('http://localhost:5001/api/posts', {
          withCredentials: true
        });
        setPosts(response.data);
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to fetch posts');
      } finally {
        hideLoading();
      }
    };

    fetchPosts();
  }, [showLoading, hideLoading, showError]);

  const handleDelete = async (id) => {
    try {
      showLoading();
      await axios.delete(`http://localhost:5001/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to delete post');
    } finally {
      hideLoading();
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
        <Typography variant="h4" component="h1">
          Blog Posts
        </Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
          >
            Create Post
          </Button>
        )}
      </Box>
      
      <Grid container spacing={3}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {post.author?.username?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                }
                title={post.author?.username || 'Unknown'}
                subheader={new Date(post.createdAt).toLocaleDateString()}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 && '...'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/post/${post._id}`)}
                >
                  Read More
                </Button>
                {user && user.id === post.author?._id && (
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => navigate(`/edit/${post._id}`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(post._id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PostList;