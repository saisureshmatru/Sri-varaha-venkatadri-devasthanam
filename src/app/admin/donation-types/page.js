'use client';

import { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Switch, FormControlLabel, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import ReceiptIcon from '@mui/icons-material/Receipt';

export default function DonationTypesAdmin() {
  const [types, setTypes] = useState([]);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [formData, setFormData] = useState({ name_en: '', name_te: '', is_active: true });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, [page, rowsPerPage]);

  const fetchTypes = async () => {
    try {
      const res = await fetch(`/api/admin/donation-types?page=${page}&limit=${rowsPerPage}`);
      const data = await res.json();
      setTypes(data.data || []);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleOpen = (type = null) => {
    if (type) {
      setEditingId(type.id);
      setFormData({ name_en: type.name_en, name_te: type.name_te, is_active: type.is_active });
    } else {
      setEditingId(null);
      setFormData({ name_en: '', name_te: '', is_active: true });
    }
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingId ? `/api/admin/donation-types/${editingId}` : '/api/admin/donation-types';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setOpen(false);
        fetchTypes();
      }
    } catch (error) {
      console.error('Failed to save donation type', error);
    }
  };

  const handleSoftDelete = async (id, currentStatus) => {
    if (currentStatus && !confirm('Are you sure you want to deactivate this donation type?')) return;
    
    // If currently active, we DELETE (which sets is_active to false in API)
    // If currently inactive, we PUT (to restore is_active to true)
    try {
      if (currentStatus) {
        const res = await fetch(`/api/admin/donation-types/${id}`, { method: 'DELETE' });
        if (res.ok) fetchTypes();
      } else {
        const typeToRestore = types.find(t => t.id === id);
        const res = await fetch(`/api/admin/donation-types/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...typeToRestore, is_active: true }),
        });
        if (res.ok) fetchTypes();
      }
    } catch (error) {
      console.error('Failed to toggle status', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Donation Types</Typography>
        <Button variant="contained" color="primary" sx={{ color: 'white', minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }} onClick={() => handleOpen()}>
          <Typography sx={{ display: { xs: 'inline', sm: 'none' }, fontSize: '1.2rem', lineHeight: 1 }}>+</Typography>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>+ Add New Type</Box>
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {types.map((type) => (
          <Box key={type.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
            <Card sx={{ 
              width: '100%',
              position: 'relative', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              opacity: type.is_active ? 1 : 0.6,
              transition: 'opacity 0.3s'
            }}>
              <Box sx={{ p: 2, bgcolor: type.is_active ? 'rgba(105, 108, 255, 0.08)' : 'rgba(133, 146, 163, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 48, color: type.is_active ? 'primary.main' : 'text.secondary' }} />
              </Box>
              <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                <IconButton 
                  color="primary" 
                  size="small"
                  onClick={() => handleOpen(type)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton 
                  color={type.is_active ? "error" : "success"} 
                  size="small"
                  onClick={() => handleSoftDelete(type.id, type.is_active)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                >
                  {type.is_active ? <DeleteIcon fontSize="small" /> : <RestoreIcon fontSize="small" />}
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1, pb: '16px !important', pt: 3, overflow: 'hidden' }}>
                <Typography variant="h6" fontWeight="bold" noWrap>
                  {type.name_en}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                  {type.name_te}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={type.is_active ? "Active" : "Inactive"} 
                    size="small" 
                    color={type.is_active ? "success" : "default"} 
                    sx={{ fontWeight: 'bold' }} 
                  />
                  <Typography variant="caption" color="text.secondary">
                    ID: {type.id}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
        {types.length === 0 && (
          <Box sx={{ width: '100%' }}>
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No donation types found.</Typography>
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{editingId ? 'Edit Donation Type' : 'Add Donation Type'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField label="Name (English)" name="name_en" value={formData.name_en} onChange={handleChange} fullWidth required size="small" />
            <TextField label="Name (Telugu)" name="name_te" value={formData.name_te} onChange={handleChange} fullWidth required size="small" />
            <FormControlLabel
              control={<Switch checked={formData.is_active} onChange={handleChange} name="is_active" color="primary" />}
              label="Active Status"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
