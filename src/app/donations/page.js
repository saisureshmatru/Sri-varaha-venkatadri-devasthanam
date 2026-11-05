'use client';

import { Container, Typography, Grid, Card, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select, Dialog, DialogTitle, DialogContent, DialogActions, Avatar, Divider, Chip, Pagination } from '@mui/material';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DonationsPage() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [donors, setDonors] = useState([]);
  const [donationTypes, setDonationTypes] = useState([]);
  const [customAmount, setCustomAmount] = useState(false);

  const amountPresets = [100, 200, 500, 1000];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    amount: '',
    type: '',
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Fetch Donors with Pagination
    fetch(`/api/public/donations?page=${page}&limit=9`)
      .then(res => res.json())
      .then(result => {
        if (result.data) {
          setDonors(result.data);
          setTotalPages(result.pagination?.totalPages || 1);
        } else if (Array.isArray(result)) {
          // Fallback if API hasn't updated yet
          setDonors(result);
        }
      })
      .catch(console.error);
  }, [page]);

  useEffect(() => {
    // Fetch Dynamic Donation Types
    fetch('/api/public/donation-types')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDonationTypes(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, type: data[0].name_en }));
          }
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePresetSelect = (amt) => {
    setCustomAmount(false);
    setFormData((prev) => ({ ...prev, amount: amt }));
  };

  const handleDonate = (e) => {
    e.preventDefault();
    if (parseInt(formData.amount) < 30) {
      alert('Minimum donation amount is ₹30');
      return;
    }
    alert(`Initiating donation for ₹${formData.amount} towards ${formData.type}`);
    setOpen(false);
  };

  return (
    <Box sx={{ pb: 10, bgcolor: 'background.default' }}>
      {/* Hero Section - Matching History Page */}
      <Box sx={{
        position: 'relative',
        height: '60vh',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/images/gallery2.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(62, 0, 0, 0.6)'
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', mt: -8 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)', color: 'white', fontFamily: 'var(--font-poppins)', fontSize: { xs: '2.2rem', md: '3rem' } }}>
              {t('Donations.supportTemple')}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto', fontFamily: 'var(--font-poppins)', mb: 3, fontSize: { xs: '1rem', md: '1.15rem' } }}>
              {t('Donations.supportDesc')}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setOpen(true)}
              sx={{ px: 4, py: 1.2, borderRadius: 10, fontWeight: 'bold', fontFamily: 'var(--font-poppins)', fontSize: '1rem', boxShadow: '0 8px 15px rgba(0,0,0,0.3)' }}
            >
              {t('Donations.makeDonation')}
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Main Content Overlapping Banner */}
      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -10 }, position: 'relative', zIndex: 2 }}>
        <Box sx={{
          bgcolor: 'background.paper',
          borderRadius: 4,
          px: { xs: 4, md: 8 },
          pt: { xs: 4, md: 5 },
          pb: { xs: 4, md: 8 },
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
          borderTop: '6px solid',
          borderColor: 'secondary.main'
        }}>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <Typography variant="h3" fontWeight="bold" fontFamily="var(--font-poppins)" gutterBottom textAlign="center" sx={{ color: '#3E0000', fontSize: { xs: '2rem', md: '2.5rem' } }}>
              {t('Donations.recentDonors')}
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" mb={6} sx={{ fontSize: '1.1rem' }}>
              {t('Donations.donorsDesc')}
            </Typography>

            {donors.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  {donors.map((donor) => (
                    <Grid item xs={12} sm={6} md={4} key={donor.id}>
                      <Card sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2.5,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }
                      }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', color: '#1F0000', width: 50, height: 50, mr: 2 }}>
                          <AccountCircleIcon fontSize="large" />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary.main" sx={{ fontFamily: 'var(--font-poppins)' }}>
                            {donor.donor_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(donor.created_at).toLocaleDateString()}
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Chip
                            label={`₹${donor.amount}`}
                            size="small"
                            sx={{ bgcolor: 'rgba(236,165,26,0.1)', color: '#8B6508', fontWeight: 'bold', fontFamily: 'var(--font-poppins)', fontSize: '0.9rem', py: 2 }}
                          />
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={(e, val) => setPage(val)}
                      color="secondary"
                      size="large"
                      sx={{ '& .MuiPaginationItem-root': { fontFamily: 'var(--font-poppins)', fontWeight: 'bold' } }}
                    />
                  </Box>
                )}
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>{t('Donations.noDonations')}</Typography>
              </Box>
            )}
          </motion.div>

        </Box>
      </Container>

      {/* Donation Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ bgcolor: 'white', color: '#3E0000', pb: 2 }}>
          <Typography variant="h5" fontWeight="bold" fontFamily="var(--font-poppins)" textAlign="center" pt={1}>
            {t('Donations.divineContribution')}
          </Typography>
        </DialogTitle>
        <Divider sx={{ borderColor: '#ECA51A', borderWidth: 2 }} />

        <form onSubmit={handleDonate}>
          <DialogContent sx={{ p: 4, pt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: '100%' }}>
                <TextField required fullWidth size="small" label={t('Donations.fullName')} name="name" value={formData.name} onChange={handleChange} />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField fullWidth size="small" label={t('Donations.email')} name="email" type="email" value={formData.email} onChange={handleChange} />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField required fullWidth size="small" label={t('Donations.phone')} name="phone" value={formData.phone} onChange={handleChange} />
              </Box>

              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <FormControl fullWidth required size="small">
                  <InputLabel>{t('Donations.donationType')}</InputLabel>
                  <Select name="type" value={formData.type} label={t('Donations.donationType')} onChange={handleChange}>
                    {donationTypes.map((type) => (
                      <MenuItem key={type.id} value={type.name_en}>
                        {lang === 'te' ? type.name_te : type.name_en}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <TextField fullWidth size="small" label={t('Donations.panOptional')} name="pan" value={formData.pan} onChange={handleChange} />
              </Box>

              <Box sx={{ width: '100%' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>Select Amount (₹)</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2, alignItems: 'center' }}>
                  {amountPresets.map(amt => (
                    <Chip 
                      key={amt} 
                      label={`₹${amt}`} 
                      onClick={() => handlePresetSelect(amt)}
                      sx={{ 
                        px: 1, py: 1.5, fontSize: '0.95rem', fontWeight: 'bold', 
                        bgcolor: formData.amount === amt && !customAmount ? '#3E0000' : 'transparent',
                        color: formData.amount === amt && !customAmount ? 'white' : '#3E0000',
                        border: '2px solid #3E0000',
                        transition: 'all 0.2s',
                        '&:hover': { bgcolor: 'rgba(62,0,0,0.1)' }
                      }} 
                    />
                  ))}
                  <Chip 
                    label="Custom Amount" 
                    onClick={() => { setCustomAmount(true); setFormData(prev => ({...prev, amount: ''})); }}
                    sx={{ 
                      px: 1, py: 1.5, fontSize: '0.95rem', fontWeight: 'bold',
                      bgcolor: customAmount ? '#3E0000' : 'transparent',
                      color: customAmount ? 'white' : '#3E0000',
                      border: '2px solid #3E0000',
                      transition: 'all 0.2s',
                      '&:hover': { bgcolor: 'rgba(62,0,0,0.1)' }
                    }} 
                  />
                </Box>
              </Box>

              {customAmount && (
                <Box sx={{ width: '100%' }}>
                  <TextField required fullWidth size="small" label={t('Donations.amount')} name="amount" type="number" inputProps={{ min: 30 }} value={formData.amount} onChange={handleChange} autoFocus />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
            <Button onClick={() => setOpen(false)} color="inherit" sx={{ fontWeight: 'bold' }}>
              {t('Donations.cancel')}
            </Button>
            <Button type="submit" variant="contained" color="secondary" size="large" sx={{ fontWeight: 'bold', color: '#1F0000', px: 4, borderRadius: 10 }}>
              {t('Donations.proceedPay')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
