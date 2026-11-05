'use client';

import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

export default function ContactPage() {
  return (
    <Box sx={{ pb: 10, pt: 6 }}>
      <Container maxWidth="lg">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h2" color="primary.main" fontWeight="bold" textAlign="center" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
            We are here to assist you with any inquiries regarding sevas, donations, or general information.
          </Typography>
        </motion.div>

        <Grid container spacing={6}>
          <Grid item xs={12} md={5}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Card sx={{ borderRadius: 4, borderLeft: '4px solid', borderColor: 'secondary.main', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                    <Box sx={{ bgcolor: 'primary.light', p: 1.5, borderRadius: 2, display: 'flex' }}>
                      <LocationOnIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">Address</Typography>
                      <Typography variant="body1" color="text.secondary">123 Divine Path, Spiritual District, Temple City 500001</Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, borderLeft: '4px solid', borderColor: 'secondary.main', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                    <Box sx={{ bgcolor: 'primary.light', p: 1.5, borderRadius: 2, display: 'flex' }}>
                      <PhoneIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">Phone</Typography>
                      <Typography variant="body1" color="text.secondary">+91 98765 43210</Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 4, borderLeft: '4px solid', borderColor: 'secondary.main', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3, p: 3 }}>
                    <Box sx={{ bgcolor: 'primary.light', p: 1.5, borderRadius: 2, display: 'flex' }}>
                      <EmailIcon sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">Email</Typography>
                      <Typography variant="body1" color="text.secondary">info@templetrust.org</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={7}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', p: 4 }}>
                <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
                  Send us a Message
                </Typography>
                <form>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Full Name" variant="outlined" required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField fullWidth label="Email Address" variant="outlined" required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Subject" variant="outlined" required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField fullWidth label="Your Message" variant="outlined" multiline rows={5} required />
                    </Grid>
                    <Grid item xs={12}>
                      <Button variant="contained" color="secondary" size="large" sx={{ py: 1.5, px: 4 }}>
                        Send Message
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
