import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Rating,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { feedbackAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <Box sx={{
      textAlign: 'center',
      mb: 4,
      p: 3,
      borderRadius: 2,
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
    }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 600,
          color: 'text.primary',
        }}
      >
        Your Rating:
      </Typography>
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => {
          onRatingChange(newValue);
        }}
        size="large"
        max={5}
        sx={{
          fontSize: '3rem',
          '& .MuiRating-iconFilled': {
            color: '#ffc107',
          },
          '& .MuiRating-iconHover': {
            color: '#ffb300',
          },
          '& .MuiRating-iconEmpty': {
            color: '#e0e0e0',
          },
        }}
      />
      {rating > 0 && (
        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: 'text.secondary',
            fontStyle: 'italic',
          }}
        >
          {rating} star{rating !== 1 ? 's' : ''} selected
        </Typography>
      )}
    </Box>
  );
};

const Feedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      setMessage('Please log in to submit feedback');
      navigate('/login');
      return;
    }

    if (!rating) {
      setMessage('Please select a rating before submitting');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await feedbackAPI.submitFeedback({
        rating: Number(rating),
        comment
      });

      setMessage('Thank you for your feedback!');
      setRating(0);
      setComment('');
    } catch (error) {
      setMessage('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 700,
            mb: 2,
          }}
        >
          Share Your Feedback
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: 600,
            mx: 'auto',
            opacity: 0.8,
          }}
        >
          Help us improve our services by sharing your experience
        </Typography>
      </Box>

      <Card
        sx={{
          maxWidth: 600,
          mx: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          borderRadius: 3,
          overflow: 'visible',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <StarRating rating={rating} onRatingChange={setRating} />

          <TextField
            fullWidth
            label="Comments"
            placeholder="Tell us about your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

          {message && (
            <Alert
              severity={message.includes('Thank you') ? 'success' : 'error'}
              sx={{
                mb: 3,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  fontSize: 24,
                },
              }}
            >
              {message}
            </Alert>
          )}

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            fullWidth
            size="large"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
              },
            }}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Feedback;
