'use client';

import { 
  Box, Typography, Card, CardContent, Button, CardMedia,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, MenuItem, Select, FormControl, InputLabel, TablePagination, Chip
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';

export default function AdminEventsList({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents || []);
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '', title_te: '', description: '', description_te: '', event_date: '', type: 'EVENT', image_url: ''
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(initialEvents ? initialEvents.length : 0);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`/api/admin/events?page=${page}&limit=${rowsPerPage}`);
        const data = await res.json();
        setEvents(data.data || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Failed to fetch paginated events', error);
      }
    };
    fetchEvents();
  }, [page, rowsPerPage]);

  const handleOpen = (evt = null) => {
    if (evt) {
      setEditingEvent(evt.id);
      setFormData({
        title: evt.title || '', title_te: evt.title_te || '', 
        description: evt.description || '', description_te: evt.description_te || '',
        event_date: evt.event_date ? new Date(evt.event_date).toISOString().slice(0, 16) : '', 
        type: evt.type || 'EVENT', image_url: evt.image_url || ''
      });
    } else {
      setEditingEvent(null);
      setFormData({ title: '', title_te: '', description: '', description_te: '', event_date: '', type: 'EVENT', image_url: '' });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const url = editingEvent ? `/api/admin/events/${editingEvent}` : `/api/admin/events`;
    const method = editingEvent ? 'PUT' : 'POST';

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
        alert('Failed to save event');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    if (currentStatus && !confirm('Are you sure you want to deactivate this event?')) return;
    try {
      if (currentStatus) {
        const res = await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setEvents(events.map(evt => evt.id === id ? { ...evt, is_active: false } : evt));
          router.refresh();
        }
      } else {
        const eventToRestore = events.find(e => e.id === id);
        const res = await fetch(`/api/admin/events/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...eventToRestore, is_active: true }),
        });
        if (res.ok) {
          setEvents(events.map(evt => evt.id === id ? { ...evt, is_active: true } : evt));
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
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>Events & Festivals</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ color: 'white', minWidth: { xs: '40px', sm: 'auto' }, px: { xs: 1, sm: 2 } }}>
          <Typography sx={{ display: { xs: 'inline', sm: 'none' }, fontSize: '1.2rem', lineHeight: 1 }}>+</Typography>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>+ Add New Event</Box>
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {events.map((evt) => (
            <Box key={evt.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <Card sx={{ 
                width: '100%',
                position: 'relative', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                opacity: evt.is_active ? 1 : 0.6,
                transition: 'opacity 0.3s'
              }}>
                <CardMedia
                  component="img"
                  height="160"
                  image="/temple_logo.jpg"
                  alt="Event"
                  sx={{ filter: evt.is_active ? 'none' : 'grayscale(100%)', objectFit: 'cover' }}
                />
                <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 1 }}>
                  <IconButton 
                    color="primary" 
                    size="small"
                    onClick={() => handleOpen(evt)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    color={evt.is_active ? "error" : "success"} 
                    size="small"
                    onClick={() => handleToggle(evt.id, evt.is_active)}
                    sx={{ bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' }, boxShadow: 1 }}
                  >
                    {evt.is_active ? <DeleteIcon fontSize="small" /> : <RestoreIcon fontSize="small" />}
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1, pb: '16px !important', pt: 2, overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip label={evt.type} size="small" color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
                    <Typography variant="caption" color="text.secondary" fontWeight="bold">
                      {evt.event_date ? new Date(evt.event_date).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" noWrap>
                    {evt.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                    {evt.title_te}
                  </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {evt.id}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {events.length === 0 && (
            <Grid item xs={12}>
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No events found.</Typography>
            </Grid>
          )}
        </Grid>
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
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 1 }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Title (English)" name="title" value={formData.title} onChange={handleChange} required size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Title (Telugu) / శీర్షిక" name="title_te" value={formData.title_te} onChange={handleChange} size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <TextField fullWidth label="Event Date" name="event_date" type="datetime-local" InputLabelProps={{ shrink: true }} value={formData.event_date} onChange={handleChange} size="small" />
            </Box>
            <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select name="type" value={formData.type} label="Type" onChange={handleChange}>
                  <MenuItem value="EVENT">Event</MenuItem>
                  <MenuItem value="FESTIVAL">Festival</MenuItem>
                  <MenuItem value="ANNOUNCEMENT">Announcement</MenuItem>
                </Select>
              </FormControl>
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
