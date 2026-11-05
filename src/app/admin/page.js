'use client';

import { Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Donations', value: '₹45,00,000' },
    { title: 'Total Donors', value: '1,254' },
    { title: 'Total Sevas Booked', value: '8,400' },
    { title: "Today's Donations", value: '₹1,50,000' }
  ];

  const chartData = [
    { name: 'Jan', donations: 400000 },
    { name: 'Feb', donations: 300000 },
    { name: 'Mar', donations: 500000 },
    { name: 'Apr', donations: 450000 },
    { name: 'May', donations: 600000 },
    { name: 'Jun', donations: 800000 },
    { name: 'Jul', donations: 750000 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Dashboard Overview</Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {stat.title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Donations Overview
              </Typography>
              <Box sx={{ height: 350, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Donations']} />
                    <Line type="monotone" dataKey="donations" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <Box sx={{ height: 300, overflowY: 'auto' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>• New general donation received (₹5,000)</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>• Abhishekam seva booked for tomorrow</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>• Admin updated gallery album</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>• New user registration: 'Rama'</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
