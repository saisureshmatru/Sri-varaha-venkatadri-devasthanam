'use client';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Tooltip, IconButton } from '@mui/material';

export default function FloatingDonateButton() {
  return (
    <Tooltip title="Make a Donation" placement="left" arrow>
      <IconButton 
        href="/donations"
        sx={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          backgroundColor: '#1F0000',
          color: 'white',
          padding: '12px',
          borderRadius: '50%',
          boxShadow: '0 8px 20px rgba(31, 0, 0, 0.4)',
          zIndex: 9999,
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '@keyframes internalShimmer': {
            '0%': { left: '-100%' },
            '15%': { left: '200%' },
            '100%': { left: '200%' }
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '50%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
            transform: 'skewX(-20deg)',
            animation: 'internalShimmer 5s infinite ease-in-out',
          },
          '&:hover': {
            backgroundColor: '#ECA51A',
            color: '#1F0000',
            transform: 'translateY(-3px) scale(1.05)',
            boxShadow: '0 12px 25px rgba(236, 165, 26, 0.4)',
            '&::after': {
              animation: 'none'
            }
          }
        }}
      >
        <VolunteerActivismIcon fontSize="medium" />
      </IconButton>
    </Tooltip>
  );
}
