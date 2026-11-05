'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Paper, Grid, IconButton, CircularProgress, Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Card, CardContent, CardMedia, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AdminGalleryList from '@/components/admin/AdminGalleryList';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`media-tabpanel-${index}`} aria-labelledby={`media-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MediaManager({ initialGalleryItems }) {
  const [tabValue, setTabValue] = useState(0);
  const galleryRef = useRef(null);
  
  // Banners State
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Banner Dialog State
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerFile, setBannerFile] = useState(null);

  useEffect(() => {
    if (tabValue === 0 && banners.length === 0) {
      fetchBanners();
    }
  }, [tabValue]);

  const fetchBanners = async () => {
    setLoadingBanners(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      setBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoadingBanners(false);
    }
  };

  const handleBannerSave = async () => {
    if (!bannerFile) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', bannerFile);
    formData.append('title', bannerTitle);

    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setBannerDialogOpen(false);
        setBannerTitle('');
        setBannerFile(null);
        fetchBanners();
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload error');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleBanner = async (id, currentStatus) => {
    if (currentStatus && !confirm('Are you sure you want to deactivate this banner?')) return;
    try {
      if (currentStatus) {
        const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
        if (res.ok) fetchBanners();
      } else {
        const res = await fetch(`/api/admin/banners/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: true }),
        });
        if (res.ok) fetchBanners();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'background.default', pt: 1, pb: 1, borderBottom: '1px solid', borderColor: 'divider', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Media Management</Typography>
          {tabValue === 0 ? (
            <Button
              variant="contained"
              color="primary"
              sx={{ color: 'white', minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }}
              disabled={uploading}
              onClick={() => setBannerDialogOpen(true)}
            >
              {uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 1 }}>{uploading ? 'Uploading...' : 'Upload New Banner'}</Box>
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              sx={{ color: 'white', minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }}
              onClick={() => galleryRef.current?.handleOpen()}
            >
              <Typography sx={{ display: { xs: 'inline', sm: 'none' }, fontSize: '1.2rem', lineHeight: 1 }}>+</Typography>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>+ Add New Gallery Item</Box>
            </Button>
          )}
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="media tabs" variant="scrollable" scrollButtons="auto">
            <Tab label="Home Banners" />
            <Tab label="Gallery" />
          </Tabs>
        </Box>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {loadingBanners ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {banners.map((banner) => (
              <Box key={banner.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
                <Card sx={{ 
                  width: '100%',
                  position: 'relative', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: banner.is_active ? 1 : 0.6,
                  transition: 'opacity 0.3s'
                }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={banner.image_url}
                    alt={banner.title || 'Banner'}
                    sx={{ objectFit: 'cover', filter: banner.is_active ? 'none' : 'grayscale(100%)' }}
                  />
                  <IconButton 
                    color={banner.is_active ? "error" : "success"}
                    size="small"
                    onClick={() => handleToggleBanner(banner.id, banner.is_active)}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                      '&:hover': { bgcolor: 'white' },
                      boxShadow: 1
                    }}
                  >
                    {banner.is_active ? <DeleteIcon /> : <RestoreIcon />}
                  </IconButton>
                  <CardContent sx={{ flexGrow: 1, pb: '16px !important', overflow: 'hidden' }}>
                    <Typography variant="subtitle1" fontWeight="bold" noWrap>
                      {banner.title || 'Untitled'}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Chip label={`Order: ${banner.display_order}`} size="small" />
                      <Chip 
                        label={banner.is_active ? "Active" : "Inactive"} 
                        size="small" 
                        color={banner.is_active ? "success" : "default"} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
            {banners.length === 0 && (
              <Box sx={{ width: '100%' }}>
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No banners uploaded yet.</Typography>
              </Box>
            )}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AdminGalleryList ref={galleryRef} initialItems={initialGalleryItems} />
      </TabPanel>

      <Dialog open={bannerDialogOpen} onClose={() => setBannerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>Upload Home Banner</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(70% - 8px)' } }}>
              <TextField 
                size="small"
                fullWidth 
                label="Banner Title" 
                value={bannerTitle} 
                onChange={(e) => setBannerTitle(e.target.value)} 
                required 
              />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(30% - 8px)' } }}>
              <Button component="label" variant="contained" color="primary" fullWidth sx={{ height: '40px' }}>
                {bannerFile ? bannerFile.name.substring(0, 10) + '...' : 'Select File'}
                <input 
                  type="file" 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 4 * 1024 * 1024) {
                      alert('File size exceeds 4MB limit');
                      return;
                    }
                    setBannerFile(file);
                  }} 
                />
              </Button>
            </Box>
            {bannerFile && (
              <Box sx={{ width: '100%', mt: 2, textAlign: 'center' }}>
                <Box 
                  component="img" 
                  src={URL.createObjectURL(bannerFile)} 
                  alt="Preview" 
                  sx={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 1, objectFit: 'contain' }}
                />
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', pb: 3, px: 3 }}>
          <Button onClick={() => setBannerDialogOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleBannerSave} variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'Saving...' : 'Save Banner'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
