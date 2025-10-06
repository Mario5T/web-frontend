import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  RestaurantMenu as MenuIcon,
  DirectionsBus as ShuttleIcon,
  Feedback as FeedbackIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const muiTheme = useMuiTheme();

  const cards = [
    {
      title: 'Menu',
      description: 'View and order from the cafeteria menu',
      icon: <MenuIcon sx={{ fontSize: 40 }} />,
      path: '/menu',
      color: darkMode ? '#ff6b00' : '#ff6b00',
    },
    {
      title: 'Shuttle',
      description: 'Track shuttle locations in real-time',
      icon: <ShuttleIcon sx={{ fontSize: 40 }} />,
      path: '/shuttle',
      color: darkMode ? '#0088ff' : '#0056b3',
    },
    {
      title: 'Feedback',
      description: 'Share your thoughts and suggestions',
      icon: <FeedbackIcon sx={{ fontSize: 40 }} />,
      path: '/feedback',
      color: darkMode ? '#4caf50' : '#2e7d32',
    },
    {
      title: 'Profile',
      description: 'Manage your account settings',
      icon: <ProfileIcon sx={{ fontSize: 40 }} />,
      path: '/profile',
      color: darkMode ? '#9c27b0' : '#7b1fa2',
    },
  ];

  return (
    <Box className="fade-in" sx={{ py: 4 }}>
      <Box 
        sx={{
          mb: 5,
          p: 4,
          borderRadius: '16px',
          background: darkMode 
            ? 'linear-gradient(135deg, rgba(0,86,179,0.2) 0%, rgba(18,18,18,0) 100%)'
            : 'linear-gradient(135deg, rgba(0,86,179,0.1) 0%, rgba(248,249,250,0) 100%)',
          boxShadow: '0 8px 32px rgba(0, 86, 179, 0.08)',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 700,
            background: darkMode
              ? 'linear-gradient(90deg, #0056b3 0%, #0088ff 100%)'
              : 'linear-gradient(90deg, #0056b3 30%, #0088ff 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
          }}
        >
          Welcome, {user?.name || 'User'}!
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            opacity: 0.8,
            fontWeight: 500,
            maxWidth: '600px',
          }}
        >
          Access all campus services from one convenient dashboard. What would you like to do today?
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={card.title} className="slide-up" style={{animationDelay: `${index * 0.1}s`}}>
            <Card
              onClick={() => navigate(card.path)}
              sx={{
                height: '100%',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                background: `linear-gradient(135deg, ${card.color}22 0%, ${darkMode ? '#121212' : '#ffffff'} 100%)`,
                '&:hover': {
                  transform: 'translateY(-12px) scale(1.02)',
                  boxShadow: `0 20px 40px ${card.color}33`,
                  '& .card-icon-container': {
                    transform: 'scale(1.1)',
                    background: `${card.color}33`,
                  },
                  '& .card-title': {
                    color: card.color,
                  },
                  '&::after': {
                    opacity: 1,
                  }
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: `linear-gradient(90deg, ${card.color} 0%, ${card.color}88 100%)`,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box 
                  className="card-icon-container"
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    mb: 3,
                    color: card.color,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {React.cloneElement(card.icon, { sx: { fontSize: 40, color: card.color } })}
                </Box>
                <Typography 
                  variant="h6" 
                  component="h2" 
                  className="card-title"
                  sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {card.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    opacity: 0.8,
                    flexGrow: 1,
                  }}
                >
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
