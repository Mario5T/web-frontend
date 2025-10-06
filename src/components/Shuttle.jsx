import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Button,
  Switch,
  FormControlLabel,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  LocationOff as LocationOffIcon,
  DirectionsBus as BusIcon,
} from '@mui/icons-material';
import { shuttleAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import locationService from '../services/locationService';
import MapView from './MapView';

const Shuttle = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [adminLocation, setAdminLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const { user } = useAuth();
  const { darkMode } = useTheme();
  // Default location (Pune, India)
  const defaultLocation = {
    coords: {
      latitude: 18.5204,
      longitude: 73.8567,
      accuracy: 10
    }
  };

  useEffect(() => {
    fetchDrivers();
    if (user?.role === 'admin') {
      getAdminLocation();
    }
    const interval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await shuttleAPI.getDrivers();
      setDrivers(response.data || []);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setDrivers([]); // Ensure drivers is an empty array on error
      setError('Failed to fetch drivers. Please try again later.');
      
      // If admin user, make sure we still show their location even if driver fetch fails
      if (user?.role === 'admin') {
        getAdminLocation();
      }
    } finally {
      setLoading(false);
    }
  };

  const getAdminLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await locationService.getCurrentPosition();
      setAdminLocation(location);
    } catch (err) {
      console.error('Error getting admin location:', err);
    } finally {
      setLocationLoading(false);
    }
  };

  const handleLocationToggle = async () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      try {
        const permission = await locationService.requestPermission();
        if (permission.status === 'granted') {
          const location = await locationService.getCurrentPosition();
          console.log('Driver location:', location);
        }
      } catch (err) {
        console.error('Error toggling location:', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'online':
        return 'success';
      case 'offline':
      case 'inactive':
        return 'default';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress color="primary" size={60} thickness={4} className="pulse" />
      </Box>
    );
  }

  return (
    <Box className="fade-in">
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          background: darkMode 
            ? 'linear-gradient(90deg, rgba(0,86,179,0.2) 0%, rgba(18,18,18,0) 100%)'
            : 'linear-gradient(90deg, rgba(0,86,179,0.1) 0%, rgba(248,249,250,0) 100%)',
          padding: '16px 24px',
          borderRadius: '12px',
        }}
      >
        <Box display="flex" alignItems="center">
          <BusIcon 
            sx={{ 
              fontSize: 40, 
              color: 'primary.main',
              mr: 2,
              animation: 'pulse 2s infinite'
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontWeight: 600,
              background: darkMode
                ? 'linear-gradient(90deg, #0056b3 0%, #0088ff 100%)'
                : 'linear-gradient(90deg, #0056b3 30%, #0088ff 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Shuttle Tracking
          </Typography>
        </Box>
        {user?.role === 'driver' && (
          <FormControlLabel
            control={
              <Switch
                checked={isTracking}
                onChange={handleLocationToggle}
                color="primary"
                sx={{ 
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#0056b3',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#0088ff',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ fontWeight: 500, color: isTracking ? '#0088ff' : 'text.secondary' }}>
                {isTracking ? "Location Sharing ON" : "Location Sharing OFF"}
              </Typography>
            }
          />
        )}
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)'
          }}
          className="slide-up"
        >
          {error}
        </Alert>
      )}

      {user?.role === 'driver' && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(3, 169, 244, 0.15)'
          }}
          className="slide-up"
        >
          {isTracking
            ? "Your location is being shared with users for shuttle tracking."
            : "Enable location sharing to help users track shuttle locations."
          }
        </Alert>
      )}

      <Grid container spacing={3} className="fade-in">
        {drivers.length === 0 ? (
          <Grid item xs={12}>
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 4,
                borderRadius: '12px',
                border: '1px dashed',
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No registered drivers
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Please check back later for shuttle updates
              </Typography>
              
              <Box mt={2}>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
                  <LocationIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Current Location
                </Typography>
                
                {locationLoading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress size={30} thickness={4} />
                  </Box>
                ) : (
                  <Box sx={{ px: 3, maxWidth: '600px', mx: 'auto' }}>
                    <MapView 
                      location={adminLocation?.coords || defaultLocation.coords} 
                      title="Current Location"
                      description="Your current location"
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        ) : (
          drivers.map((driver, index) => (
            <Grid item xs={12} md={6} key={index} className="slide-up" style={{animationDelay: `${index * 0.1}s`}}>
              <Card 
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: darkMode 
                      ? '0 16px 32px rgba(0, 86, 179, 0.3)' 
                      : '0 16px 32px rgba(0, 86, 179, 0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, #0056b3 0%, #0088ff 100%)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Box 
                      sx={{ 
                        backgroundColor: darkMode ? 'rgba(0, 86, 179, 0.2)' : 'rgba(0, 86, 179, 0.1)',
                        borderRadius: '50%',
                        width: 48,
                        height: 48,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <PersonIcon sx={{ color: '#0056b3', fontSize: 28 }} />
                    </Box>
                    <Box flexGrow={1}>
                      <Typography 
                        variant="h6" 
                        component="h2"
                        sx={{ 
                          fontWeight: 600,
                          mb: 0.5
                        }}
                      >
                        {driver.name || driver.fullName || `Driver ${index + 1}`}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                          fontWeight: 500
                        }}
                      >
                        Route: {driver.route || 'Not specified'}
                      </Typography>
                    </Box>
                    <Chip
                      label={driver.status || 'Unknown'}
                      color={getStatusColor(driver.status)}
                      size="small"
                      sx={{ 
                        fontWeight: 600,
                        borderRadius: '6px',
                        px: 1
                      }}
                    />
                  </Box>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Box 
                      sx={{ 
                        backgroundColor: darkMode ? 'rgba(0, 86, 179, 0.2)' : 'rgba(0, 86, 179, 0.1)',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      <PhoneIcon sx={{ color: '#0056b3', fontSize: 20 }} />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {driver.phone || driver.phoneNumber || 'No phone number'}
                    </Typography>
                    {driver.phone && (
                      <Button
                        size="small"
                        variant="contained"
                        href={`tel:${driver.phone}`}
                        sx={{ 
                          ml: 2,
                          minWidth: 'auto',
                          borderRadius: '8px',
                          background: 'linear-gradient(90deg, #0056b3 0%, #0088ff 100%)',
                        }}
                      >
                        Call
                      </Button>
                    )}
                  </Box>

                  <Box display="flex" alignItems="center">
                    <Box 
                      sx={{ 
                        backgroundColor: darkMode ? 'rgba(0, 86, 179, 0.2)' : 'rgba(0, 86, 179, 0.1)',
                        borderRadius: '50%',
                        width: 36,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}
                    >
                      {isTracking ? (
                        <LocationIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                      ) : (
                        <LocationOffIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />
                      )}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }} color={isTracking ? 'success.main' : 'text.secondary'}>
                      {isTracking ? 'Live tracking active' : 'Location not shared'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {drivers.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No drivers registered
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Drivers will appear here when they register and share their location
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Shuttle;
