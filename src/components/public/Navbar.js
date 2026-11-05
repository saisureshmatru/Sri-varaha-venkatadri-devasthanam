'use client';

import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Drawer, List, ListItem, ListItemText, Switch
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
  const pathname = usePathname();
  const { lang, changeLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navState, setNavState] = useState({ hasSevas: true, hasFestivals: true });
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock for now, connect to real auth later
  const [isAdmin, setIsAdmin] = useState(false); // Mock for now

  useEffect(() => {
    fetch('/api/public/nav-state')
      .then(res => res.json())
      .then(data => setNavState(data))
      .catch(console.error);

    // Mock check for logged in user (e.g. check local storage or auth context)
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole'); // 'admin' or 'user'
    if (token) {
      setIsLoggedIn(true);
      if (userRole === 'admin') setIsAdmin(true);
    }
  }, []);

  let navItems = [
    { label: t('Navbar.home'), path: '/' },
  ];

  if (navState.hasSevas) navItems.push({ label: t('Navbar.sevas'), path: '/sevas' });
  if (navState.hasFestivals) navItems.push({ label: t('Navbar.festivals'), path: '/festivals' });
  navItems.push({ label: t('Navbar.donations') || 'Donations', path: '/donations' });
  navItems.push({ label: t('Navbar.gallery'), path: '/gallery' });
  navItems.push({ label: t('Navbar.history'), path: '/history' });

  // Only show contact if logged in
  if (isLoggedIn) {
    navItems.push({ label: t('Navbar.contact'), path: '/contact' });
  }

  // Admin link only for admins
  if (isAdmin) {
    navItems.push({ label: t('Navbar.admin'), path: '/admin' });
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: 'background.paper', height: '100%' }} role="presentation" onClick={handleDrawerToggle}>
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold" color="primary.main">Menu</Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.path} component={Link} href={item.path} sx={{
            color: pathname === item.path ? 'secondary.main' : 'text.primary',
            mb: 1, borderRadius: 2, mx: 1
          }}>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: pathname === item.path ? 700 : 500 }} />
          </ListItem>
        ))}
        {!isLoggedIn && (
          <ListItem button component={Link} href="/auth/login" sx={{ color: 'primary.main', mb: 1, borderRadius: 2, mx: 1 }}>
            <ListItemText primary="Sign In" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
        )}
      </List>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2" fontWeight="bold">Language: {(lang || 'en').toUpperCase()}</Typography>
        <Switch
          checked={lang === 'te'}
          onChange={(e) => changeLanguage(e.target.checked ? 'te' : 'en')}
          color="secondary"
        />
      </Box>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={4} sx={{
      background: 'linear-gradient(90deg, #F8E395 0%, #F5D365 50%, #C29B28 100%)',
      borderBottom: '4px solid #3E0000'
    }}>
      {/* Top Tier: Logo and Title */}
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          {/* Mobile Menu Icon (absolute left) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ position: 'absolute', left: 16, display: { md: 'none' }, color: '#3E0000' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none' }} component={Link} href="/">
              <Box
                component="img"
                src="/logo.jpg"
                alt="Sri Varaha Venkatadri Devasthanam Logo"
                sx={{
                  height: { xs: 45, md: 60 },
                  width: { xs: 45, md: 60 },
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #ECA51A',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: '#3E0000', // matches bottom nav items
                  fontFamily: 'var(--font-poppins)',
                  fontSize: { xs: '1rem', md: '1.25rem' }
                }}
              >
                {t('Navbar.title')}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Bottom Tier: Navigation Links */}
      <Box sx={{
        display: { xs: 'none', md: 'block' },
        pb: 1
      }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: '48px !important', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  href={item.path}
                  sx={{
                    color: pathname === item.path ? '#7B1818' : '#3E0000',
                    fontWeight: pathname === item.path ? 800 : 600,
                    fontSize: '0.9rem',
                    textTransform: 'none',
                    letterSpacing: 0.5,
                    px: 2,
                    '&:hover': {
                      color: '#7B1818',
                      backgroundColor: 'rgba(62,0,0,0.05)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Language & Auth (Right aligned in bottom tier) */}
            <Box sx={{ position: 'absolute', right: 24, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#3E0000' }}>
                <Typography variant="caption" sx={{ fontWeight: lang === 'en' ? 'bold' : 'normal', opacity: lang === 'en' ? 1 : 0.6 }}>E</Typography>
                <Switch
                  checked={lang === 'te'}
                  onChange={(e) => changeLanguage(e.target.checked ? 'te' : 'en')}
                  color="default"
                  size="small"
                  sx={{ mx: 0.5, '& .MuiSwitch-thumb': { bgcolor: '#3E0000' }, '& .MuiSwitch-track': { bgcolor: 'rgba(62,0,0,0.5)' } }}
                />
                <Typography variant="caption" sx={{ fontWeight: lang === 'te' ? 'bold' : 'normal', opacity: lang === 'te' ? 1 : 0.6 }}>T</Typography>
              </Box>

              {!isLoggedIn ? (
                <Button
                  variant="outlined"
                  size="small"
                  component={Link}
                  href="/auth/login"
                  sx={{ color: '#3E0000', borderColor: '#3E0000', borderRadius: 5, fontWeight: 'bold', '&:hover': { borderColor: '#7B1818', color: '#7B1818', bgcolor: 'rgba(62,0,0,0.05)' } }}
                >
                  Sign In
                </Button>
              ) : (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('userRole'); setIsLoggedIn(false); setIsAdmin(false); }}
                  sx={{ color: '#3E0000', opacity: 0.8, fontWeight: 'bold', '&:hover': { opacity: 1 } }}
                >
                  Logout
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}
