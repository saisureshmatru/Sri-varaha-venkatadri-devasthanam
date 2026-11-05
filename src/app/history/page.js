'use client';

import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HistoryPage() {
  const { t } = useLanguage();
  return (
    <Box sx={{ pb: 10 }}>
      {/* Hero Section */}
      <Box sx={{
        position: 'relative',
        height: '60vh',
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("/images/gallery6.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(62, 0, 0, 0.6)' // Deep Maroon overlay matching theme
        }
      }}>
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', mt: -2 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Typography variant="h1" fontWeight="bold" gutterBottom sx={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)', color: 'white', fontFamily: 'var(--font-poppins)' }}>
              {t('HistoryPage.heroTitle')}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto', fontFamily: 'var(--font-poppins)' }}>
              {t('HistoryPage.heroSub')}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -6, md: -10 }, position: 'relative', zIndex: 2 }}>
        <Box sx={{
          bgcolor: 'background.paper',
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
          borderTop: '6px solid',
          borderColor: 'secondary.main'
        }}>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center', mb: 8 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {t('HistoryPage.originsTitle')}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {t('HistoryPage.originsP1')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {t('HistoryPage.originsP2')}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, height: 350, width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <Box sx={{
                  width: '100%', height: '100%',
                  backgroundImage: 'url("/images/gallery1.jpg")',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }} />
              </Box>
            </Box>
          </motion.div>

          <Box sx={{ width: '100%', height: '1px', bgcolor: 'grey.200', my: 8 }} />

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, gap: 6, alignItems: 'center' }}>
              <Box sx={{ flex: 1, height: 350, width: '100%', borderRadius: 4, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                <Box sx={{
                  width: '100%', height: '100%',
                  backgroundImage: 'url("/images/gallery5.jpg")',
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  transition: 'transform 0.5s ease',
                  '&:hover': { transform: 'scale(1.05)' }
                }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {t('HistoryPage.modernTitle')}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {t('HistoryPage.modernP1')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                  {t('HistoryPage.modernP2')}
                </Typography>
              </Box>
            </Box>
          </motion.div>

        </Box>
      </Container>
    </Box>
  );
}
