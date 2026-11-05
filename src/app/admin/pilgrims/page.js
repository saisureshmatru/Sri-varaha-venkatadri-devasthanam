'use client';

import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function PilgrimsManagementPage() {
  const pilgrims = [
    { id: 1, name: 'Srinivas Rao', email: 'srinivas@example.com', phone: '+91 9876543211', joinedDate: '2026-08-20' },
    { id: 2, name: 'Lakshmi N', email: 'lakshmi@example.com', phone: '+91 9876543212', joinedDate: '2026-08-21' },
    { id: 3, name: 'Pilgrim User', email: 'user@example.com', phone: '+91 9876543210', joinedDate: '2026-08-22' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">Pilgrims Management</Typography>
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Joined Date</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pilgrims.map((pilgrim) => (
                  <TableRow key={pilgrim.id}>
                    <TableCell>{pilgrim.id}</TableCell>
                    <TableCell>{pilgrim.name}</TableCell>
                    <TableCell>{pilgrim.email}</TableCell>
                    <TableCell>{pilgrim.phone}</TableCell>
                    <TableCell>{pilgrim.joinedDate}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" color="primary">View Bookings</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
