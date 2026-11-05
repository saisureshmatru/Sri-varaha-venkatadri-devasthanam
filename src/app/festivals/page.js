import { query } from '@/lib/db';
import { Container, Typography, Grid, Card, CardContent, Box, Chip } from '@mui/material';
import BilingualText from '@/components/public/BilingualText';

export default async function FestivalsPage() {
  let festivals = [];
  try {
    const res = await query("SELECT * FROM events WHERE type = 'FESTIVAL' AND is_active = true ORDER BY event_date ASC");
    festivals = res.rows;
  } catch (error) {
    console.error('Failed to fetch festivals:', error);
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" color="primary.main" gutterBottom textAlign="center">
        Upcoming Festivals
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" textAlign="center" paragraph>
        Join us in celebrating our grand traditions and divine festivals.
      </Typography>

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
        {festivals.length === 0 && (
          <Typography variant="h6" color="text.secondary" sx={{ mx: 'auto', mt: 4 }}>
            No upcoming festivals at the moment.
          </Typography>
        )}
        {festivals.map((festival) => (
          <Box key={festival.id} sx={{ width: { xs: '100%', md: 'calc(50% - 16px)' } }}>
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
                    backgroundImage: `url(${festival.image_url || 'https://images.unsplash.com/photo-1604608685160-5f257a3e7db1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
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
                    <Typography variant="h5" component="h3" color="white" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      <BilingualText en={festival.title} te={festival.title_te} />
                    </Typography>
                    <Typography variant="subtitle2" color="primary.light" fontWeight="600">
                      {new Date(festival.event_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Chip 
                    label={festival.type} 
                    color="primary" 
                    size="small" 
                    sx={{ position: 'absolute', top: 16, right: 16, fontWeight: 'bold' }} 
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    <BilingualText en={festival.description || 'Details coming soon.'} te={festival.description_te || 'త్వరలో వివరాలు.'} />
                  </Typography>
                </CardContent>
              </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
}
