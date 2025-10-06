import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (event, newRole) => {
    if (newRole !== null) {
      setFormData({
        ...formData,
        role: newRole,
        email: '',
        phone: '',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.role === 'student' || formData.role === 'admin') {
      if (!formData.email) {
        setError(`${formData.role === 'student' ? 'Student' : 'Admin'} login requires email`);
        return false;
      }
    }

    if (formData.role === 'driver') {
      if (!formData.phone) {
        setError('Driver login requires phone number');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    const credentials =
      formData.role === 'student' || formData.role === 'admin'
        ? { email: formData.email, password: formData.password, role: formData.role }
        : { phone: formData.phone, password: formData.password, role: formData.role };

    const result = await login(credentials);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            width: '100%',
            maxWidth: { xs: '100%', sm: 400, md: 500 },
            mx: 'auto',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>

          <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
            Choose Your Role
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <ToggleButtonGroup
              value={formData.role}
              exclusive
              onChange={handleRoleChange}
              aria-label="role selection"
            >
              <ToggleButton value="student" aria-label="student">
                Student
              </ToggleButton>
              <ToggleButton value="driver" aria-label="driver">
                Driver
              </ToggleButton>
              <ToggleButton value="admin" aria-label="admin">
                Admin
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {(formData.role === 'student' || formData.role === 'admin') && (
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
              />
            )}

            {formData.role === 'driver' && (
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                margin="normal"
              />
            )}

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
