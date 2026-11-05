'use client';
import { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Button, Card, CardContent } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import GalleryGrid from '@/components/public/GalleryGrid';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteContent, setSiteContent] = useState(null);
  const [galleryImages, setGalleryImages] = useState([
    '/images/gallery1.jpg',
    '/images/gallery2.jpg',
    '/images/gallery3.jpg',
    '/images/gallery4.jpg',
    '/images/gallery5.jpg',
    '/images/gallery6.jpg',
    '/images/gallery7.jpg',
    '/images/gallery8.jpg'
  ]);

  useEffect(() => {
    fetch('/api/public/content')
      .then(r => r.json())
      .then(data => setSiteContent(data))
      .catch(console.error);

    fetch('/api/public/gallery')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          const fallbackImages = [
            '/images/gallery1.jpg', '/images/gallery2.jpg', '/images/gallery3.jpg', '/images/gallery4.jpg',
            '/images/gallery5.jpg', '/images/gallery6.jpg', '/images/gallery7.jpg', '/images/gallery8.jpg'
          ];
          let displayImages = [...fallbackImages];
          data.slice(0, 10).forEach((item, i) => {
            if (i < displayImages.length) displayImages[i] = item.media_url;
            else displayImages.push(item.media_url);
          });
          setGalleryImages(displayImages.slice(0, 10)); // max 10 for home page
        }
      })
      .catch(console.error);
  }, []);

  const getText = (key, fallback) => {
    if (!siteContent) return fallback;
    const item = siteContent[key];
    if (!item) return fallback;
    return item[lang || 'en'] || fallback;
  };

  useEffect(() => {
    fetch('/api/public/banners')
      .then(r => r.json())
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          setBanners([
            { id: '1', image_url: '/images/banner1.jpg' },
            { id: '2', image_url: '/images/banner2.jpg' },
            { id: '3', image_url: '/images/banner3.jpg' }
          ]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <Box sx={{ pb: 10, bgcolor: 'background.default' }}>
      
      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #F8E395 0%, #E6C153 60%, #C99320 100%)',
        overflow: 'hidden'
      }}>
        {/* Dynamic Carousel Background */}
        <AnimatePresence>
          {banners.length > 0 && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${banners[currentSlide].image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0
              }}
            />
          )}
        </AnimatePresence>

        {/* Gradient Overlay Shadow for Text Readability & Cinematic effect */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(62,0,0,0.7) 100%)',
          boxShadow: 'inset 0 0 150px rgba(0,0,0,0.6)',
          zIndex: 1
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3, textAlign: 'center', mt: 4 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Typography variant="h2" fontWeight="bold" gutterBottom sx={{ color: 'white', textShadow: '0 4px 10px rgba(0,0,0,0.8)', fontFamily: 'var(--font-poppins)', fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              {getText('home_welcome', t('Home.welcome'))}
            </Typography>
            <Typography variant="h6" sx={{ color: 'white', opacity: 0.9, maxWidth: 800, mx: 'auto', textShadow: '0 2px 5px rgba(0,0,0,0.8)', fontFamily: 'var(--font-poppins)', fontWeight: 400 }}>
              {getText('home_subtitle', t('Home.subtitle'))}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 5, pb: 6 }}>
              <Button variant="contained" color="secondary" size="large" sx={{ fontWeight: 'bold', px: 4, py: 1.5, borderRadius: 10, fontFamily: 'var(--font-poppins)' }}>
                {t('Home.donateNow')}
              </Button>
              <Button variant="outlined" sx={{ color: 'white', borderColor: 'white', fontWeight: 'bold', px: 4, py: 1.5, borderRadius: 10, fontFamily: 'var(--font-poppins)', '&:hover': { borderColor: '#ECA51A', color: '#ECA51A' } }}>
                {t('Home.bookSeva')}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Our History Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column-reverse', md: 'row' }, 
            gap: 6, 
            mt: 2,
            alignItems: 'center'
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" color="primary.main" fontWeight="bold" gutterBottom>
                {t('Home.ourHistory')}
              </Typography>
              <Box sx={{ borderLeft: '4px solid #ECA51A', pl: 3, mb: 4, mt: 3 }}>
                <Typography variant="body1" color="primary.main" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                  {getText('home_history_intro', t('Home.historyIntro'))}
                </Typography>
              </Box>
              
              <Typography variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                {getText('home_history_main', t('Home.historyMain'))}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                <Button 
                  variant="contained" 
                  component={Link}
                  href="/history"
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    borderRadius: 10,
                    px: 4, py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  {t('Home.viewFullHistory')}
                </Button>
              </Box>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.05, y: -10 }}
                style={{ width: '100%', maxWidth: 320 }}
              >
                <Box component="img" src="/images/history-balaji.jpg" 
                  sx={{ 
                    width: '100%', 
                    height: 'auto',
                    objectFit: 'cover', 
                    borderRadius: 4, 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    }
                  }} 
                />
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Temple Gallery Section */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}>
          <Typography variant="h3" color="primary.main" fontWeight="bold" textAlign="center" gutterBottom>
            {t('Home.templeGallery')}
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
            {t('Home.gallerySubtext')}
          </Typography>

          <GalleryGrid images={galleryImages} />

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              component={Link}
              href="/gallery"
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white', 
                borderRadius: 10,
                px: 4, py: 1.5,
                fontWeight: 'bold',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              {t('Home.viewFullGallery')}
            </Button>
          </Box>
        </motion.div>
      </Container>
      
    </Box>
  );
}
