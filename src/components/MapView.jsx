import React, { useEffect, useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

const MapView = ({ location, title, description }) => {
  const mapRef = useRef(null);
  const { darkMode } = useTheme();
  
  useEffect(() => {
    // If we have a map element and location, we would initialize a map here
    // For now, we'll just display the coordinates
  }, [location]);

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Box
      ref={mapRef}
      sx={{
        height: 250,
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)',
        border: '1px solid',
        borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: darkMode ? '#90caf9' : '#0056b3' }}>
        🗺️ {title || 'Location Map'}
      </Typography>
      
      {location ? (
        <>
          <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
            Latitude: {location.latitude.toFixed(6)}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Longitude: {location.longitude.toFixed(6)}
          </Typography>
          <Button 
            variant="outlined" 
            onClick={openInGoogleMaps}
            startIcon={<span>🌎</span>}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              background: darkMode ? 'rgba(0,86,179,0.1)' : 'rgba(0,86,179,0.05)',
            }}
          >
            Open in Google Maps
          </Button>
          {description && (
            <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary', textAlign: 'center' }}>
              {description}
            </Typography>
          )}
        </>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Location data unavailable
        </Typography>
      )}
    </Box>
  );
};

export default MapView;