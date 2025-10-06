import React from 'react';
import { Box, Container, Typography, Link, IconButton, Divider } from '@mui/material';
import { GitHub as GitHubIcon, LinkedIn as LinkedInIcon, Twitter as TwitterIcon } from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { darkMode } = useTheme();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: darkMode ? '#121212' : '#f5f5f5',
        borderTop: `1px solid ${darkMode ? '#333' : '#e0e0e0'}`,
        transition: 'background-color 0.3s ease',
      }}
      className="fade-in"
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Box sx={{ mb: { xs: 2, sm: 0 } }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                background: darkMode 
                  ? 'linear-gradient(45deg, #90caf9 30%, #e3f2fd 90%)' 
                  : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              RevRacker
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ mt: 1 }}
            >
              Your campus services in one place
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', sm: 'flex-end' } }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <IconButton size="small" aria-label="github" color="primary">
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="linkedin" color="primary">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label="twitter" color="primary">
                <TwitterIcon fontSize="small" />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} RevRacker. All rights reserved.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;