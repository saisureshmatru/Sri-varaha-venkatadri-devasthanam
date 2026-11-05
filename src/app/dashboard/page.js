'use client';

import { Container, Typography, Grid, Card, CardContent, Box, Tabs, Tab } from '@mui/material';
import { useState } from 'react';

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" color="primary.main" gutterBottom>
        My Dashboard
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="My Seva Bookings" />
          <Tab label="My Donations" />
          <Tab label="Profile" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom>Upcoming Sevas</Typography>
          <Grid container spacing={3}>
            {/* Placeholder for bookings */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="secondary">Archana</Typography>
                  <Typography variant="body2" color="text.secondary">Date: 25th Aug 2026</Typography>
                  <Typography variant="body2" color="text.secondary">Time: 09:00 AM - 10:00 AM</Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>Status: Confirmed</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>Donation History</Typography>
          <Grid container spacing={3}>
            {/* Placeholder for donations */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" color="primary.dark">General Donation</Typography>
                  <Typography variant="body1">Amount: ₹1,000</Typography>
                  <Typography variant="body2" color="text.secondary">Date: 15th Aug 2026</Typography>
                  <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>Receipt Generated</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>Profile Details</Typography>
          <Card>
            <CardContent>
              <Typography><strong>Name:</strong> Pilgrim User</Typography>
              <Typography><strong>Email:</strong> user@example.com</Typography>
              <Typography><strong>Phone:</strong> +91 9876543210</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
