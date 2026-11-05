'use client';

import { Container, Typography, Grid, Card, CardContent, Button, Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { useState } from 'react';

export default function SevaBookingForm({ seva, slots }) {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [error, setError] = useState('');

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !slot) {
      setError('Please select a date and a time slot.');
      return;
    }

    try {
      const res = await fetch('/api/sevas/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sevaId: seva.id, slotId: slot, date }),
      });
      
      if (res.ok) {
        alert('Booking created successfully! Redirecting to payment...');
        // Integrate Razorpay/PhonePe here
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to book seva.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" color="primary.main" gutterBottom textAlign="center">
        Book Seva
      </Typography>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="secondary">
            {seva.title} (₹{seva.amount})
          </Typography>
          <Typography paragraph color="text.secondary">
            {seva.description || 'Please select the date and available time slot for your seva.'}
          </Typography>

          <Box component="form" onSubmit={handleBooking} sx={{ mt: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Select Date"
                  InputLabelProps={{ shrink: true }}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Select Time Slot</InputLabel>
                  <Select
                    value={slot}
                    label="Select Time Slot"
                    onChange={(e) => setSlot(e.target.value)}
                  >
                    {slots.length === 0 && <MenuItem disabled value="">No slots available</MenuItem>}
                    {slots.map(s => (
                      <MenuItem key={s.id} value={s.id}>{s.slot_time} (Capacity: {s.capacity})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary" size="large" fullWidth sx={{ color: 'white' }}>
                  Proceed to Payment (₹{seva.amount})
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
