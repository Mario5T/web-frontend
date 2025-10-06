import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';
import { menuAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Menu = () => {
  const { user } = useAuth();
  const [menuData, setMenuData] = useState({});
  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    mealType: 'breakfast',
    description: '',
  });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await menuAPI.getAllMenus();
      let data = response.data;
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      if (data && typeof data === 'object') {
        setMenuData(data);
        const dayKeys = Object.keys(data);
        setDays(dayKeys);
        if (dayKeys.length > 0 && !selectedDay) {
          setSelectedDay(dayKeys[0]);
        }
      } else {
        setMenuData({});
        setDays([]);
      }
    } catch (err) {
      setError('Failed to fetch menus');
      setMenuData({});
      setDays([]);
      console.error('Error fetching menus:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmitMenu = async () => {
    try {
      await menuAPI.uploadMenu(formData);
      setOpenDialog(false);
      setFormData({
        name: '',
        day: '',
        mealType: 'breakfast',
        description: '',
      });
      fetchMenus();
    } catch (err) {
      setError('Failed to add menu item');
      console.error('Error adding menu:', err);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      await menuAPI.uploadMenuFile(selectedFile);
      setUploadDialog(false);
      setSelectedFile(null);
      fetchMenus();
    } catch (err) {
      setError('Failed to upload menu file');
      console.error('Error uploading file:', err);
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return '#ff9800';
      case 'lunch':
        return '#4caf50';
      case 'dinner':
        return '#9c27b0';
      default:
        return '#757575';
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case 'breakfast':
        return 'primary';
      case 'lunch':
        return 'secondary';
      case 'dinner':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
              mb: 1,
            }}
          >
            Food Menu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Select a day to view the available meals
          </Typography>
        </Box>
        {user?.role === 'admin' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setUploadDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Upload File
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Add Menu Item
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 24,
            },
          }}
        >
          {error}
        </Alert>
      )}

      {days.length === 0 ? (
        <Card
          sx={{
            textAlign: 'center',
            py: 8,
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          }}
        >
          <CardContent>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              🍽️ No menu available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.role === 'admin' ? 'Add your first menu item to get started' : 'Menu will be available soon'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card sx={{ mb: 4, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <CardContent sx={{ pb: 2 }}>
              <Tabs
                value={selectedDay}
                onChange={(e, newValue) => setSelectedDay(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 2,
                  },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                    minHeight: 48,
                    px: 3,
                  },
                }}
              >
                {days.map((day) => (
                  <Tab
                    key={day}
                    label={day}
                    value={day}
                    sx={{
                      borderRadius: 2,
                      mx: 0.5,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        color: 'white',
                      },
                    }}
                  />
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {selectedDay && menuData[selectedDay] && (
            <>
              <Card
                sx={{
                  mb: 4,
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  color: 'white',
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>
                    {menuData[selectedDay].date}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
                    Today's Menu
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                {menuData[selectedDay].meals &&
                  Object.entries(menuData[selectedDay].meals).map(([category, food]) => (
                    <Grid item xs={12} md={6} key={category}>
                      <Card
                        sx={{
                          height: '100%',
                          background: `linear-gradient(135deg, ${getMealColor(category)} 0%, ${getMealColor(category)}dd 100%)`,
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            variant="h5"
                            component="h2"
                            gutterBottom
                            sx={{
                              textTransform: 'capitalize',
                              fontWeight: 600,
                              color: 'white',
                              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            }}
                          >
                            {category}
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              lineHeight: 1.6,
                              fontSize: '1.1rem',
                            }}
                          >
                            {food}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                }
              </Grid>
            </>
          )}
        </>
      )}

      {user?.role === 'admin' && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white',
            fontWeight: 600,
          }}>
            Add Menu Item
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Day"
              name="day"
              value={formData.day}
              onChange={handleInputChange}
              margin="normal"
              placeholder="e.g., Monday, Tuesday"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Meal Type</InputLabel>
              <Select
                name="mealType"
                value={formData.mealType}
                onChange={handleInputChange}
                label="Meal Type"
                sx={{ mb: 2 }}
              >
                <MenuItem value="breakfast">Breakfast</MenuItem>
                <MenuItem value="lunch">Lunch</MenuItem>
                <MenuItem value="dinner">Dinner</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitMenu}
              variant="contained"
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Add Menu
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {user?.role === 'admin' && (
        <Dialog
          open={uploadDialog}
          onClose={() => setUploadDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
          }}
        >
          <DialogTitle sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white',
            fontWeight: 600,
          }}>
            Upload Menu File
          </DialogTitle>
          <DialogContent sx={{ p: 3, textAlign: 'center' }}>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              style={{
                marginTop: 16,
                padding: '16px',
                border: '2px dashed #ddd',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
              }}
            />
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 2, color: 'success.main' }}>
                Selected: {selectedFile.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setUploadDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFileUpload}
              variant="contained"
              disabled={!selectedFile}
              sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
            >
              Upload
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default Menu;
