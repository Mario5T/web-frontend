import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Refresh as RefreshIcon,
  Logout as LogoutIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon,
  Computer as ComputerIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [logoutDialog, setLogoutDialog] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserSessions();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setError('');
      const response = await authAPI.getProfile();
      setUserData(response.data.user);
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', err);
    }
  };

  const fetchUserSessions = async () => {
    try {
      const response = await authAPI.getSessions();
      setSessions(response.data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    await Promise.all([fetchUserProfile(), fetchUserSessions()]);
    setRefreshing(false);
  };

  const handleLogout = async () => {
    setLogoutDialog(false);
    await logout();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && !userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  if (!user && !userData) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view your profile
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, sm: 3 },
      maxWidth: '100%',
      mx: 'auto',
      minHeight: '100vh',
    }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 24 },
          }}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}
      <Card
        sx={{
          mb: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
        }}
      >
        <CardContent sx={{
          p: { xs: 3, sm: 4 },
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            textAlign: { xs: 'center', md: 'left' },
          }}>
            <Avatar
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                mx: { xs: 'auto', md: 0 },
                mb: { xs: 2, md: 0 },
                mr: { md: 4 },
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 40, sm: 50, md: 60 } }} />
            </Avatar>
            <Box sx={{
              flex: 1,
              width: '100%',
            }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                }}
              >
                {userData?.name || user?.name}
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
                mb: 1,
                flexWrap: 'wrap',
                gap: 1,
              }}>
                <BadgeIcon sx={{ mr: 1, fontSize: { xs: 18, md: 20 } }} />
                <Typography
                  variant="h5"
                  sx={{
                    textTransform: 'capitalize',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  }}
                >
                  {userData?.role || user?.role}
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: { xs: 'center', md: 'flex-start' },
              }}>
                {(userData?.email || user?.email) ? (
                  <>
                    <EmailIcon sx={{ mr: 1, fontSize: { xs: 16, md: 18 } }} />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        wordBreak: 'break-word',
                      }}
                    >
                      {userData?.email || user?.email}
                    </Typography>
                  </>
                ) : (
                  <>
                    <PhoneIcon sx={{ mr: 1, fontSize: { xs: 16, md: 18 } }} />
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9rem', md: '1rem' },
                      }}
                    >
                      {userData?.phone || user?.phone}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} lg={8}>
          <Card sx={{
            height: '100%',
            minHeight: { xs: 300, md: 400 },
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 3,
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                  }}
                >
                  Active Sessions
                </Typography>
                <ComputerIcon color="primary" sx={{ fontSize: { xs: 24, md: 28 } }} />
              </Box>

              {sessions.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {sessions.map((session, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{
                        px: 0,
                        py: { xs: 1.5, sm: 2 },
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                      }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          mb: { xs: 1, sm: 0 },
                        }}>
                          <ComputerIcon sx={{
                            mr: 2,
                            color: 'text.secondary',
                            fontSize: { xs: 20, md: 24 },
                          }} />
                          <ListItemText
                            primary={
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexWrap: 'wrap',
                              }}>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 500,
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                  }}
                                >
                                  {session.device || 'Unknown Device'}
                                </Typography>
                                <Chip
                                  label="Active"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  sx={{
                                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                                    height: { xs: 20, md: 24 },
                                  }}
                                />
                              </Box>
                            }
                          />
                        </Box>
                        <Box sx={{
                          width: '100%',
                          pl: { xs: 0, sm: 5 },
                        }}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 0.5,
                          }}>
                            <AccessTimeIcon sx={{
                              mr: 1,
                              fontSize: 16,
                              color: 'text.secondary',
                            }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                            >
                              Last active: {formatDate(session.lastActive)}
                            </Typography>
                          </Box>
                          {session.ip && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationIcon sx={{
                                mr: 1,
                                fontSize: 16,
                                color: 'text.secondary',
                              }} />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                              >
                                IP: {session.ip}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </ListItem>
                      {index < sessions.length - 1 && (
                        <Divider sx={{ my: { xs: 1, sm: 1.5 } }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{
                  textAlign: 'center',
                  py: { xs: 4, md: 6 },
                }}>
                  <ComputerIcon sx={{
                    fontSize: { xs: 48, md: 64 },
                    color: 'text.disabled',
                    mb: 2,
                  }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
                  >
                    No active sessions found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{
            mb: 3,
            order: { xs: -1, lg: 0 },
          }}>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  fontSize: { xs: '1.1rem', sm: '1.25rem' },
                }}
              >
                Account Information
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                }}>
                  <CalendarIcon sx={{
                    mr: 2,
                    color: 'text.secondary',
                    fontSize: { xs: 20, md: 24 },
                  }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
                  >
                    Member Since:
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    ml: 4,
                    fontWeight: 500,
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  }}
                >
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                }}>
                  <BadgeIcon sx={{
                    mr: 2,
                    color: 'text.secondary',
                    fontSize: { xs: 20, md: 24 },
                  }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
                  >
                    User ID:
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    ml: 4,
                    fontFamily: 'monospace',
                    bgcolor: 'grey.50',
                    p: { xs: 1, sm: 1.5 },
                    borderRadius: 1,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    wordBreak: 'break-all',
                  }}
                >
                  {userData?.id || user?.id || 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                }}
              >
                {refreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<LogoutIcon />}
                onClick={() => setLogoutDialog(true)}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  py: { xs: 1.2, sm: 1.5 },
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  background: 'linear-gradient(45deg, #dc004e 30%, #ff5983 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b0003a 30%, #e91e63 90%)',
                  },
                }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={logoutDialog}
        onClose={() => setLogoutDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            m: { xs: 2, sm: 3 },
          },
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(45deg, #dc004e 30%, #ff5983 90%)',
          color: 'white',
          fontWeight: 600,
          fontSize: { xs: '1.1rem', sm: '1.25rem' },
          p: { xs: 2, sm: 3 },
        }}>
          Confirm Logout
        </DialogTitle>
        <DialogContent sx={{
          p: { xs: 2, sm: 3 },
        }}>
          <Typography
            variant="body1"
            sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
          >
            Are you sure you want to logout? You'll need to log in again to access your account.
          </Typography>
        </DialogContent>
        <DialogActions sx={{
          p: { xs: 2, sm: 3 },
          pt: 0,
          gap: { xs: 1, sm: 2 },
        }}>
          <Button
            onClick={() => setLogoutDialog(false)}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: { xs: 80, sm: 100 },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              minWidth: { xs: 80, sm: 100 },
              background: 'linear-gradient(45deg, #dc004e 30%, #ff5983 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #b0003a 30%, #e91e63 90%)',
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
