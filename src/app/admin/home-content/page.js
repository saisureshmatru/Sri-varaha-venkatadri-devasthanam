'use client';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, TextField, Divider, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

export default function AdminHomeContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (index, field, value) => {
    const newContent = [...content];
    newContent[index][field] = value;
    setContent(newContent);
  };

  const handleSave = async (item) => {
    setSavingId(item.key);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: item.key,
          value_en: item.value_en,
          value_te: item.value_te
        }),
      });
      if (res.ok) {
        setSuccessMsg(`Successfully updated ${item.key}`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Save error');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default', pb: 2, borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 1 }}>
          <Typography variant="h6" fontWeight="bold">Home Page Content</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
          Manage the text displayed on the Home Page in both English and Telugu.
        </Typography>
      </Box>

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}

      <Paper sx={{ p: 4, mt: 4 }}>
        {content.map((item, index) => (
          <Box key={item.key} sx={{ mb: 6 }}>
            <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>
              {item.key.replace(/_/g, ' ').toUpperCase()}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 2 }}>
              <TextField
                fullWidth
                label="English Text"
                multiline
                minRows={8}
                inputProps={{ maxLength: 1000 }}
                helperText={`${(item.value_en || '').length}/1000 characters`}
                value={item.value_en || ''}
                onChange={(e) => handleUpdate(index, 'value_en', e.target.value)}
              />
              <TextField
                fullWidth
                label="Telugu Text (తెలుగు)"
                multiline
                minRows={8}
                inputProps={{ maxLength: 1000 }}
                helperText={`${(item.value_te || '').length}/1000 characters`}
                value={item.value_te || ''}
                onChange={(e) => handleUpdate(index, 'value_te', e.target.value)}
              />
            </Box>
            <Button
              variant="contained"
              startIcon={savingId === item.key ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={() => handleSave(item)}
              disabled={savingId === item.key}
            >
              Save Change
            </Button>
            {index < content.length - 1 && <Divider sx={{ mt: 6 }} />}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
