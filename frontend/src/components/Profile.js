import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, TextField, Button, Avatar, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const { showLoading, hideLoading, showError } = useUI();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        showLoading();
        const response = await axios.get(`http://localhost:5001/api/profile/${id}`);
        setProfile(response.data);
        setBio(response.data.bio);
        setAvatar(response.data.avatar);
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to fetch profile');
      } finally {
        hideLoading();
      }
    };

    fetchProfile();
  }, [id, showLoading, hideLoading, showError]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      showLoading();
      const response = await axios.put(
        'http://localhost:5001/api/profile/update',
        { bio, avatar },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      showError(error.response?.data?.error || 'Failed to update profile');
    } finally {
      hideLoading();
    }
  };

  if (!profile) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={profile.avatar}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h4" gutterBottom>
          {profile.username}
        </Typography>
        
        {editing && user?.id === profile._id ? (
          <Box component="form" onSubmit={handleUpdate} sx={{ width: '100%', mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              margin="normal"
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Avatar URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={() => setEditing(false)} variant="outlined">
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ mt: 2, width: '100%' }}>
            <Typography variant="body1" gutterBottom>
              {profile.bio || 'No bio yet'}
            </Typography>
            {user?.id === profile._id && (
              <Button
                onClick={() => setEditing(true)}
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Profile;