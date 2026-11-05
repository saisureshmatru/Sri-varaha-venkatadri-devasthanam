'use client';

import { Box, Card, CardContent, Typography, TextField, Button, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Mock login for now
    localStorage.setItem('token', 'mock-token-123');
    localStorage.setItem('userRole', 'admin'); // Set role to admin by default for testing
    
    // Redirect to Admin Panel
    router.push('/admin');
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%', p: 2, borderRadius: 4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" color="primary.main" gutterBottom align="center">
            Welcome Back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={4}>
            Sign in to your account
          </Typography>
          
          <form onSubmit={handleLogin}>
            <TextField fullWidth label="Email Address" variant="outlined" margin="normal" required />
            <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" required />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 3 }}>
              <MuiLink component={Link} href="/auth/forgot-password" variant="body2" color="secondary.main" sx={{ textDecoration: 'none', fontWeight: 500 }}>
                Forgot Password?
              </MuiLink>
            </Box>
            
            <Button type="submit" fullWidth variant="contained" color="primary" size="large" sx={{ py: 1.5, mb: 3 }}>
              Sign In
            </Button>
            
            <Typography variant="body2" align="center">
              Don't have an account?{' '}
              <MuiLink component={Link} href="/auth/signup" color="secondary.main" sx={{ textDecoration: 'none', fontWeight: 'bold' }}>
                Sign Up
              </MuiLink>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
