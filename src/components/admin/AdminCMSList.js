'use client';

import { 
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, Switch, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, IconButton, TablePagination 
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AdminCMSList({ initialPages }) {
  const [pages, setPages] = useState(initialPages || []);
  const [open, setOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [formData, setFormData] = useState({
    title: '', title_te: '', slug: '', content: '', content_te: '', is_public: true
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(initialPages ? initialPages.length : 0);
  const router = useRouter();

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch(`/api/admin/cms?page=${page}&limit=${rowsPerPage}`);
        const data = await res.json();
        setPages(data.data || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Failed to fetch paginated CMS pages', error);
      }
    };
    fetchCMS();
  }, [page, rowsPerPage]);

  const handleOpen = (page = null) => {
    if (page) {
      setEditingPage(page.id);
      setFormData({
        title: page.title || '', title_te: page.title_te || '', slug: page.slug || '',
        content: page.content || '', content_te: page.content_te || '',
        is_public: page.is_public ?? true
      });
    } else {
      setEditingPage(null);
      setFormData({ title: '', title_te: '', slug: '', content: '', content_te: '', is_public: true });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    const url = editingPage ? `/api/admin/cms/${editingPage}` : `/api/admin/cms`;
    const method = editingPage ? 'PUT' : 'POST';

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
        alert('Failed to save page');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`/api/admin/cms/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPages(pages.filter(p => p.id !== id));
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    setPages(pages.map(page => page.id === id ? { ...page, is_public: newStatus } : page));
    try {
      await fetch('/api/admin/cms/toggle-public', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isPublic: newStatus }),
      });
      router.refresh();
    } catch (error) {
      setPages(pages.map(page => page.id === id ? { ...page, is_public: currentStatus } : page));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">CMS Page Management</Typography>
        <Button variant="contained" color="secondary" onClick={() => handleOpen()} sx={{ color: 'white' }}>+ Add New Page</Button>
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Title (EN / TE)</strong></TableCell>
                  <TableCell><strong>Slug</strong></TableCell>
                  <TableCell><strong>Public</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pages.length === 0 && (
                  <TableRow><TableCell colSpan={5} align="center">No CMS pages found.</TableCell></TableRow>
                )}
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>{page.id}</TableCell>
                    <TableCell>{page.title} <br/><Typography variant="caption" color="text.secondary">{page.title_te}</Typography></TableCell>
                    <TableCell>/{page.slug}</TableCell>
                    <TableCell>
                      <Switch checked={page.is_public} onChange={() => handleToggle(page.id, page.is_public)} color="secondary" />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpen(page)}><EditIcon /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(page.id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingPage ? 'Edit Page' : 'Add New Page'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Title (English)" name="title" value={formData.title} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Title (Telugu) / శీర్షిక" name="title_te" value={formData.title_te} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="URL Slug (e.g. history)" name="slug" value={formData.slug} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Content (English)" name="content" multiline rows={8} value={formData.content} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Content (Telugu) / కంటెంట్" name="content_te" multiline rows={8} value={formData.content_te} onChange={handleChange} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
