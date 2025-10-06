import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, Container, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Menu from './components/Menu';
import Shuttle from './components/Shuttle';
import Profile from './components/Profile';
import Feedback from './components/Feedback';
import Footer from './components/Footer';

function App() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Box sx={{
      flexGrow: 1,
      minHeight: '100vh',
      width: '100%',
      transition: 'background-color 0.3s ease',
    }}>
      {user && (
        <AppBar position="static" elevation={3}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
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
            <IconButton 
              onClick={toggleDarkMode} 
              color="inherit" 
              sx={{ mr: 2 }}
              aria-label="toggle dark mode"
            >
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )}
      <Container
        maxWidth={false}
        sx={{
          mt: user ? 4 : 0,
          pb: 4,
          px: { xs: 2, sm: 3, md: 4, lg: 6, xl: 8 },
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
            <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/menu" element={user ? <Menu /> : <Navigate to="/login" />} />
            <Route path="/shuttle" element={user ? <Shuttle /> : <Navigate to="/login" />} />
            <Route path="/feedback" element={user ? <Feedback /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          </Routes>
        </Box>
        {user && <Footer />}
      </Container>
    </Box>
  );
}

export default App;
