'use client';

import { Box, Card, CardContent, Typography, TextField, Button, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, borderRadius: 4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom align="center">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={4}>
            Join our spiritual community
          </Typography>
          
          <form>
            <TextField fullWidth label="Full Name" variant="outlined" margin="normal" required />
            <TextField fullWidth label="Email Address" variant="outlined" margin="normal" required />
            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" required />
            
            <Button fullWidth variant="contained" color="primary" size="large" sx={{ py: 1.5, mt: 3, mb: 3 }}>
              Sign Up
            </Button>
            
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <MuiLink component={Link} href="/auth/login" color="secondary.main" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                Sign In
              </MuiLink>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
