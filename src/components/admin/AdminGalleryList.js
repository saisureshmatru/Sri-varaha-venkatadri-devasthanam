'use client';

import { 
  Box, Typography, Card, CardContent, CardMedia, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, MenuItem, Select, FormControl, InputLabel, Chip
} from '@mui/material';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

const AdminGalleryList = forwardRef(({ initialItems }, ref) => {
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '', title_te: '', media_url: '', media_type: 'IMAGE'
  });
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    handleOpen
  }));

  const handleOpen = (item = null) => {
    if (item) {
      setEditingItem(item.id);
      setFormData({
        title: item.title || '', title_te: item.title_te || '', 
        media_url: item.media_url || '', media_type: item.media_type || 'IMAGE'
      });
    } else {
      setEditingItem(null);
      setFormData({ title: '', title_te: '', media_url: '', media_type: 'IMAGE' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const url = editingItem ? `/api/admin/gallery/${editingItem}` : `/api/admin/gallery`;
    const method = editingItem ? 'PUT' : 'POST';

    const form = new FormData();
    form.append('title', formData.title);
    form.append('title_te', formData.title_te);
    form.append('media_type', formData.media_type);
    
    if (formData.file) {
      form.append('file', formData.file);
    } else {
      form.append('media_url', formData.media_url);
    }

    try {
      const res = await fetch(url, {
        method,
        body: form,
      });
      if (res.ok) {
        handleClose();
        router.refresh();
      } else {
        alert('Failed to save gallery item');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id, isDeleted) => {
    if (!isDeleted && !confirm('Are you sure you want to deactivate this item?')) return;
    try {
      if (!isDeleted) {
        const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setItems(items.map(i => i.id === id ? { ...i, deleted_at: new Date().toISOString() } : i));
          router.refresh();
        }
      } else {
        const res = await fetch(`/api/admin/gallery/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ restore_deleted: true }),
        });
        if (res.ok) {
          setItems(items.map(i => i.id === id ? { ...i, deleted_at: null } : i));
          router.refresh();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {items.map((item) => (
            <Box key={item.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <Card sx={{ 
                width: '100%',
                position: 'relative', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                opacity: item.deleted_at ? 0.6 : 1,
                transition: 'opacity 0.3s'
              }}>
                {item.media_type === 'IMAGE' ? (
                  <CardMedia
                    component="img"
                    image={item.media_url}
                    alt={item.title || "Media"}
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                ) : (
                  <CardMedia
                    component="video"
                    src={item.media_url}
                    controls
                    sx={{ height: 200, objectFit: 'cover' }}
                  />
                )}
                <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                  <IconButton 
                    color="primary" 
                    size="small"
                    onClick={() => handleOpen(item)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color={item.deleted_at ? "success" : "error"} 
                    size="small"
                    onClick={() => handleToggle(item.id, !!item.deleted_at)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                  >
                    {item.deleted_at ? <RestoreIcon fontSize="small" /> : <DeleteIcon fontSize="small" />}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, pb: '16px !important', overflow: 'hidden' }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {item.title || 'Untitled'}
                  </Typography>
                  {item.title_te && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                      {item.title_te}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Chip 
                      label={item.deleted_at ? "Inactive" : "Active"} 
                      size="small" 
                      color={item.deleted_at ? "default" : "success"} 
                      sx={{ fontWeight: 'bold' }} 
                    />
                    <Typography variant="caption" color="text.secondary">
                      ID: {item.id.substring(0, 8)}...
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
          {items.length === 0 && (
            <Box sx={{ width: '100%' }}>
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No media found.</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{editingItem ? 'Edit Media' : 'Upload Media'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 0.5 }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField size="small" fullWidth label="Title (English)" name="title" value={formData.title} onChange={handleChange} required />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <TextField size="small" fullWidth label="Title (Telugu) / శీర్షిక" name="title_te" value={formData.title_te} onChange={handleChange} />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Media Type</InputLabel>
                <Select name="media_type" value={formData.media_type} label="Media Type" onChange={handleChange}>
                  <MenuItem value="IMAGE">Image</MenuItem>
                  <MenuItem value="VIDEO">Video</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
              <Button component="label" variant="contained" color="primary" fullWidth sx={{ height: '40px' }}>
                {formData.file ? formData.file.name.substring(0, 15) + '...' : 'Select File'}
                <input 
                  type="file" 
                  hidden 
                  accept={formData.media_type === 'IMAGE' ? 'image/*' : 'video/*'} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.size > 4 * 1024 * 1024) {
                      alert('File size exceeds 4MB limit');
                      return;
                    }
                    setFormData(prev => ({ ...prev, file }));
                  }} 
                />
              </Button>
              {formData.media_url && !formData.file && (
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>Current: {formData.media_url}</Typography>
              )}
            </Box>
            {formData.file && (
              <Box sx={{ width: '100%', mt: 2, textAlign: 'center' }}>
                {formData.media_type === 'IMAGE' ? (
                  <Box 
                    component="img" 
                    src={URL.createObjectURL(formData.file)} 
                    alt="Preview" 
                    sx={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 1, objectFit: 'contain' }}
                  />
                ) : (
                  <Box 
                    component="video" 
                    controls
                    src={URL.createObjectURL(formData.file)} 
                    sx={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 1 }}
                  />
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'flex-end', pb: 3, px: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default AdminGalleryList;
