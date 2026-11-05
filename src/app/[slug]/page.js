import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Container, Typography, Box, Paper } from '@mui/material';
import BilingualText from '@/components/public/BilingualText';
import BilingualHtml from '@/components/public/BilingualHtml';

export default async function DynamicCMSPage({ params }) {
  const { slug } = await params;

  let pageData = null;
  try {
    const res = await query('SELECT title, title_te, content, content_te FROM cms_pages WHERE slug = $1 AND is_public = true AND deleted_at IS NULL', [slug]);
    if (res.rows.length === 0) {
      return notFound();
    }
    pageData = res.rows[0];
  } catch (error) {
    console.error('Failed to fetch CMS page:', error);
    return notFound();
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Box sx={{ 
        textAlign: 'center', 
        mb: 6,
        position: 'relative',
        '&::after': {
          content: '""',
          display: 'block',
          width: '60px',
          height: '4px',
          bgcolor: 'primary.main',
          margin: '24px auto 0',
          borderRadius: 2
        }
      }}>
        <Typography variant="h2" color="primary.dark" fontWeight="bold" sx={{ letterSpacing: '-0.02em' }}>
          <BilingualText en={pageData.title} te={pageData.title_te} />
        </Typography>
      </Box>

      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          bgcolor: 'background.paper', 
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'grey.200',
          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative top border */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)' }} />
        
        <Typography 
          variant="body1" 
          component="div" 
          sx={{ 
            fontSize: '1.1rem',
            lineHeight: 1.8,
            color: 'text.secondary',
            '& p': { mb: 3 },
            '& h2, & h3': { color: 'text.primary', fontWeight: 600, mt: 4, mb: 2 },
            '& ul, & ol': { pl: 3, mb: 3 },
            '& li': { mb: 1 }
          }}
        >
          <BilingualHtml en={pageData.content} te={pageData.content_te} />
        </Typography>
      </Paper>
    </Container>
  );
}
