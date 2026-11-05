'use client';

import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <Box sx={{ bgcolor: '#1F0000', color: 'white', pt: { xs: 8, md: 10 }, pb: 4, borderTop: '4px solid #ECA51A' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box component="img" src="/logo.jpg" alt="Logo" sx={{ width: 50, height: 50, borderRadius: '50%', border: '2px solid #ECA51A' }} />
              <Typography variant="h5" color="secondary.main" fontWeight="bold" fontFamily="var(--font-poppins)">
                {t('Navbar.title')}
              </Typography>
            </Box>
            <Typography variant="body2" color="rgba(255,255,255,0.7)" paragraph sx={{ fontFamily: 'var(--font-poppins)', lineHeight: 1.8 }}>
              Experience the divine presence, spiritual peace, and ancient heritage at Sri Varaha Venkatadri Devasthanam.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
              <IconButton size="small" sx={{ color: '#ECA51A', bgcolor: 'rgba(236,165,26,0.1)', '&:hover': { bgcolor: '#ECA51A', color: '#1F0000' } }}><FacebookIcon /></IconButton>
              <IconButton size="small" sx={{ color: '#ECA51A', bgcolor: 'rgba(236,165,26,0.1)', '&:hover': { bgcolor: '#ECA51A', color: '#1F0000' } }}><TwitterIcon /></IconButton>
              <IconButton size="small" sx={{ color: '#ECA51A', bgcolor: 'rgba(236,165,26,0.1)', '&:hover': { bgcolor: '#ECA51A', color: '#1F0000' } }}><InstagramIcon /></IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" color="secondary.main" gutterBottom fontWeight="bold" fontFamily="var(--font-poppins)" sx={{ mb: 3 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Home', 'Seva Registration', 'Gallery', 'Contact'].map((link, idx) => (
                <Link key={idx} href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.95rem', fontFamily: 'var(--font-poppins)', transition: 'all 0.2s ease' }}>
                  <span style={{ transition: 'color 0.2s', display: 'inline-block' }} onMouseOver={e => e.currentTarget.style.color = '#ECA51A'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                    {link}
                  </span>
                </Link>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="secondary.main" gutterBottom fontWeight="bold" fontFamily="var(--font-poppins)" sx={{ mb: 3 }}>
              Temple Services
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['Daily Pooja', 'Special Abhishekam', 'Annual Festivals', 'Kalyana Mandapam', 'Darshan Services'].map((service, idx) => (
                <Typography key={idx} variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontFamily: 'var(--font-poppins)', fontSize: '0.95rem' }}>
                  {service}
                </Typography>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" color="secondary.main" gutterBottom fontWeight="bold" fontFamily="var(--font-poppins)" sx={{ mb: 3 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <LocationOnIcon fontSize="small" sx={{ color: 'secondary.main', mt: 0.3 }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontFamily: 'var(--font-poppins)', lineHeight: 1.6 }}>
                  Vadapalli Rd, Vadapalli,<br/>Andhra Pradesh 533237
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <PhoneIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontFamily: 'var(--font-poppins)' }}>+91 98312 71008</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <EmailIcon fontSize="small" sx={{ color: 'secondary.main' }} />
                <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontFamily: 'var(--font-poppins)' }}>6:00 AM - 8:00 PM</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 8, pt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontFamily: 'var(--font-poppins)' }}>
            © 2026 {t('Navbar.title')}. All rights reserved.
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontFamily: 'var(--font-poppins)' }}>
            Designed and Developed by <Link href="https://www.linkedin.com" target="_blank" style={{ color: '#ECA51A', fontWeight: 'bold', textDecoration: 'none' }}>Vamsi</Link> and Software solutions <Link href="https://www.linkedin.com" target="_blank" style={{ color: '#ECA51A', fontWeight: 'bold', textDecoration: 'none' }}>Saikumar Parla</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
