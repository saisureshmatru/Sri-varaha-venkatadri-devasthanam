import { query } from '@/lib/db';
import { Container, Typography, Box } from '@mui/material';
import GalleryGrid from '@/components/public/GalleryGrid';
import BilingualText from '@/components/public/BilingualText';

export default async function GalleryPage() {
  let apiImages = [];
  try {
    const res = await query("SELECT * FROM gallery_items WHERE deleted_at IS NULL ORDER BY created_at DESC");
    apiImages = res.rows;
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
  }

  const fallbackImages = [
    '/images/gallery1.jpg',
    '/images/gallery2.jpg',
    '/images/gallery3.jpg',
    '/images/gallery4.jpg',
    '/images/gallery5.jpg',
    '/images/gallery6.jpg',
    '/images/gallery7.jpg',
    '/images/gallery8.jpg'
  ];

  let displayImages = [...fallbackImages];

  apiImages.forEach((item, index) => {
    if (index < displayImages.length) {
      displayImages[index] = item.media_url;
    } else {
      displayImages.push(item.media_url);
    }
  });

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
      <Typography
        variant="h2"
        sx={{
          color: '#3E0000',
          textAlign: "center",
          fontWeight: "bold",
          fontFamily: 'var(--font-poppins)',
          fontSize: { xs: '2rem', md: '2.5rem' },
          mb: 1
        }}
      >
        <BilingualText en="Temple Gallery" te="ఆలయ గ్యాలరీ" />
      </Typography>

      {/* <Typography 
        variant="h6" 
        sx={{ 
          color: '#C99320', 
          textAlign: "center",
          fontWeight: 500,
          fontFamily: 'var(--font-poppins)',
          maxWidth: 700,
          mx: 'auto',
          mb: 4,
          lineHeight: 1.6,
          fontSize: { xs: '1rem', md: '1.1rem' }
        }}
      >
        <BilingualText 
          en="Explore the divine beauty, architectural marvels, and recent spiritual events of our temple." 
          te="మా ఆలయం యొక్క దైవిక సౌందర్యం, అద్భుతమైన వాస్తుశిల్పం మరియు ఇటీవలి ఆధ్యాత్మిక కార్యక్రమాలను అన్వేషించండి." 
        />
      </Typography> */}

      <GalleryGrid images={displayImages} />
    </Container>
  );
}
