'use client';

import { Typography, Box, Card, CardContent, Grid, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Divider } from '@mui/material';
import { useState } from 'react';

export default function SettingsPage() {
  const [paymentProvider, setPaymentProvider] = useState('razorpay');

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold">System Settings</Typography>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>General</Typography>
              <TextField fullWidth label="Temple Name" margin="normal" defaultValue="Sri Venkateswara Swamy Temple" />
              <Button variant="outlined" sx={{ mt: 2 }} component="label">
                Upload Logo
                <input type="file" hidden />
              </Button>
              <Button variant="outlined" sx={{ mt: 2, ml: 2 }} component="label">
                Upload Favicon
                <input type="file" hidden />
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Payment Gateway</Typography>
              <FormControl component="fieldset">
                <RadioGroup row value={paymentProvider} onChange={(e) => setPaymentProvider(e.target.value)}>
                  <FormControlLabel value="razorpay" control={<Radio />} label="Razorpay" />
                  <FormControlLabel value="phonepe" control={<Radio />} label="PhonePe" />
                </RadioGroup>
              </FormControl>
              
              <Divider sx={{ my: 2 }} />
              
              {paymentProvider === 'razorpay' ? (
                <Box>
                  <TextField fullWidth label="Key ID" margin="normal" />
                  <TextField fullWidth label="Key Secret" type="password" margin="normal" />
                </Box>
              ) : (
                <Box>
                  <TextField fullWidth label="Merchant ID" margin="normal" />
                  <TextField fullWidth label="Salt Key" type="password" margin="normal" />
                  <TextField fullWidth label="Salt Index" margin="normal" />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Cloudflare R2 Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Cloudflare R2 Storage</Typography>
              <TextField fullWidth label="Account ID" margin="normal" />
              <TextField fullWidth label="Access Key" margin="normal" />
              <TextField fullWidth label="Secret Key" type="password" margin="normal" />
              <TextField fullWidth label="Bucket Name" margin="normal" />
              <TextField fullWidth label="Public URL" margin="normal" />
              <Button variant="contained" color="secondary" sx={{ mt: 2, color: 'white' }}>
                Test Connection
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Brevo Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Brevo Email</Typography>
              <TextField fullWidth label="API Key" type="password" margin="normal" />
              <TextField fullWidth label="Sender Name" margin="normal" />
              <TextField fullWidth label="Sender Email" margin="normal" />
              <Button variant="contained" color="secondary" sx={{ mt: 2, color: 'white' }}>
                Test Email
              </Button>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" size="large" sx={{ color: 'white' }}>
          Save All Settings
        </Button>
      </Box>
    </Box>
  );
}
