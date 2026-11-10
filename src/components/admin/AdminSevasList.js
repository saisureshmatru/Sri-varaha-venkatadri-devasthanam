'use client';

import {
  Box, Typography, Card, CardContent, Button, Switch,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, TablePagination, Chip
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import SpaIcon from '@mui/icons-material/Spa';

export default function AdminSevasList({ initialSevas }) {
  const [sevas, setSevas] = useState(initialSevas || []);
  const [open, setOpen] = useState(false);
  const [editingSeva, setEditingSeva] = useState(null);
  const [formData, setFormData] = useState({
    title: '', title_te: '', slug: '', description: '', description_te: '', amount: '', is_public: true
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(initialSevas ? initialSevas.length : 0);
  const router = useRouter();

  useEffect(() => {
    const fetchSevas = async () => {
      try {
        const res = await fetch(`/api/admin/sevas?page=${page}&limit=${rowsPerPage}`);
        const data = await res.json();
        setSevas(data.data || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Failed to fetch paginated sevas', error);
      }
    };
    fetchSevas();
  }, [page, rowsPerPage]);

  const handleOpen = (seva = null) => {
    if (seva) {
      setEditingSeva(seva.id);
      setFormData({
        title: seva.title || '', title_te: seva.title_te || '', slug: seva.slug || '',
        description: seva.description || '', description_te: seva.description_te || '',
        amount: seva.amount || '', is_public: seva.is_public ?? true
      });
    } else {
      setEditingSeva(null);
      setFormData({ title: '', title_te: '', slug: '', description: '', description_te: '', amount: '', is_public: true });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    const url = editingSeva ? `/api/admin/sevas/${editingSeva}` : `/api/admin/sevas`;
    const method = editingSeva ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        handleClose();
        router.refresh();
      } else {
        alert('Failed to save seva');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    if (currentStatus && !confirm('Are you sure you want to deactivate this seva?')) return;
    try {
      if (currentStatus) {
        const res = await fetch(`/api/admin/sevas/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setSevas(sevas.map(seva => seva.id === id ? { ...seva, is_public: false } : seva));
          router.refresh();
        }
      } else {
        const sevaToRestore = sevas.find(s => s.id === id);
        const res = await fetch(`/api/admin/sevas/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...sevaToRestore, is_public: true }),
        });
        if (res.ok) {
          setSevas(sevas.map(seva => seva.id === id ? { ...seva, is_public: true } : seva));
          router.refresh();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Seva & Slot Management</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ color: 'white', minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }}>
          <Typography sx={{ display: { xs: 'inline', sm: 'none' }, fontSize: '1.2rem', lineHeight: 1 }}>+</Typography>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>+ Add New Seva</Box>
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {sevas.map((seva) => (
            <Grid item xs={12} sm={6} md={4} key={seva.id}>
              <Card sx={{
                width: '100%',
                position: 'relative',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                opacity: seva.is_public ? 1 : 0.6,
                transition: 'opacity 0.3s'
              }}>
                <Box sx={{ p: 2, bgcolor: seva.is_public ? 'rgba(105, 108, 255, 0.08)' : 'rgba(133, 146, 163, 0.08)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <SpaIcon sx={{ fontSize: 48, color: seva.is_public ? 'primary.main' : 'text.secondary' }} />
                </Box>
                <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleOpen(seva)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color={seva.is_public ? "error" : "success"}
                    size="small"
                    onClick={() => handleToggle(seva.id, seva.is_public)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                  >
                    {seva.is_public ? <DeleteIcon fontSize="small" /> : <RestoreIcon fontSize="small" />}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, pb: '16px !important', pt: 3, overflow: 'hidden' }}>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {seva.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                    {seva.title_te}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary.main" fontWeight="bold">
                      ₹{seva.amount}
                    </Typography>
                    <Chip
                      label={seva.is_public ? "Active" : "Inactive"}
                      size="small"
                      color={seva.is_public ? "success" : "default"}
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                    Slug: {seva.slug}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {sevas.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No sevas found.</Typography>
            </Grid>
          )}
        </Grid>
      </Box>

      {total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
          sx={{ mt: 2 }}
        />
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{editingSeva ? 'Edit Seva' : 'Add New Seva'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Title (English)" name="title" value={formData.title} onChange={handleChange} required size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Title (Telugu) / శీర్షిక" name="title_te" value={formData.title_te} onChange={handleChange} size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="URL Slug (e.g. archana-seva)" name="slug" value={formData.slug} onChange={handleChange} required size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Amount (₹)" name="amount" type="number" value={formData.amount} onChange={handleChange} required size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Description (English)" name="description" multiline rows={3} value={formData.description} onChange={handleChange} size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Description (Telugu) / వివరణ" name="description_te" multiline rows={3} value={formData.description_te} onChange={handleChange} size="small" />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
