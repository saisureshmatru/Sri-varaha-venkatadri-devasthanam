'use client';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

export default function GalleryGrid({ images }) {
  return (
    <Box sx={{ 
      display: 'grid', 
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(12, 1fr)' },
      gridAutoRows: { xs: '200px', md: '250px' },
      gap: 3 
    }}>
      {images.map((imgSrc, index, arr) => {
        let colSpan = 4;
        let rowSpan = 1;
        
        const blockIndex = Math.floor(index / 4);
        const isLastBlock = blockIndex === Math.floor((arr.length - 1) / 4);
        const itemsInThisBlock = isLastBlock ? (arr.length % 4 || 4) : 4;
        const posInBlock = index % 4;

        if (itemsInThisBlock === 4) {
            const isReversed = blockIndex % 2 === 1; 
            if (!isReversed) {
              // Block A (Standard): Large Left, Top Right, Bottom Right 1, Bottom Right 2
              if (posInBlock === 0) { colSpan = 6; rowSpan = 2; }
              else if (posInBlock === 1) { colSpan = 6; rowSpan = 1; }
              else if (posInBlock === 2) { colSpan = 3; rowSpan = 1; }
              else if (posInBlock === 3) { colSpan = 3; rowSpan = 1; }
            } else {
              // Block B (Reversed): Top Left, Large Right, Bottom Left 1, Bottom Left 2
              if (posInBlock === 0) { colSpan = 6; rowSpan = 1; }
              else if (posInBlock === 1) { colSpan = 6; rowSpan = 2; }
              else if (posInBlock === 2) { colSpan = 3; rowSpan = 1; }
              else if (posInBlock === 3) { colSpan = 3; rowSpan = 1; }
            }
        } else if (itemsInThisBlock === 2) {
            // 2 leftovers: 50% / 50%
            colSpan = 6;
            rowSpan = 2; 
        } else if (itemsInThisBlock === 1) {
            // 1 leftover: Full width
            colSpan = 12;
            rowSpan = 2;
        } else if (itemsInThisBlock === 3) {
            // 3 leftovers: 1 full width on top, 2 half width on bottom
            if (posInBlock === 0) { colSpan = 12; rowSpan = 1; }
            else { colSpan = 6; rowSpan = 1; }
        }

        return (
          <Box key={index} sx={{ 
            gridColumn: { xs: 'span 12', md: `span ${colSpan}` }, 
            gridRow: { md: `span ${rowSpan}` },
            height: '100%',
            width: '100%'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: posInBlock * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
            >
              <Box component="img" src={imgSrc} 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  display: 'block', 
                  transition: 'opacity 0.3s ease, filter 0.3s ease', 
                  '&:hover': { opacity: 0.95, filter: 'brightness(1.1)' } 
                }} 
              />
            </motion.div>
          </Box>
        );
      })}
    </Box>
  );
}
