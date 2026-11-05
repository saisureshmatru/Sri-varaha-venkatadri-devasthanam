'use client';

import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function SevasList({ sevas }) {
  const { t, language } = useLanguage();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Typography variant="h3" color="primary.main" gutterBottom textAlign="center">
          {t('SevasList.title')}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" textAlign="center" paragraph>
          {t('SevasList.subtitle')}
        </Typography>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {sevas.length === 0 && (
            <Typography variant="h6" color="text.secondary" sx={{ mx: 'auto', mt: 4 }}>
              {t('SevasList.noneAvailable')}
            </Typography>
          )}
          {sevas.map((seva) => {
            const title = (language === 'te' && seva.title_te) ? seva.title_te : seva.title;
            const description = (language === 'te' && seva.description_te) ? seva.description_te : seva.description;
            
            return (
              <Box key={seva.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 21.33px)' } }}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      '& .card-image': {
                        transform: 'scale(1.08)'
                      }
                    }
                  }}>
                    <Box sx={{ 
                      height: 220, 
                      position: 'relative',
                      overflow: 'hidden',
                      bgcolor: 'grey.900'
                    }}>
                      <Box className="card-image" sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundImage: `url('https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} />
                      {/* Dark Gradient Overlay for text pop */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '70%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-end',
                        p: 2.5
                      }}>
                        <Typography variant="h5" component="h2" color="white" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                          {title}
                        </Typography>
                        <Typography variant="subtitle1" color="primary.light" fontWeight="600">
                          ₹{seva.amount}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{ flexGrow: 1, lineHeight: 1.7 }}>
                        {description || t('SevasList.defaultDescription')}
                      </Typography>
                      <Button 
                        component={Link} 
                        href={`/sevas/${seva.slug || seva.id}`} 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        sx={{ 
                          mt: 'auto', 
                          color: 'white',
                          py: 1.2,
                          borderRadius: 2,
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          fontWeight: 'bold',
                          boxShadow: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.23)'
                          }
                        }}
                      >
                        {t('SevasList.bookNow')}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            );
          })}
        </Box>
      </motion.div>
    </Container>
  );
}
