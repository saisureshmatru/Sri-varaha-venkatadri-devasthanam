'use client';

import { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, AppBar, Toolbar, Divider, IconButton, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import SpaIcon from '@mui/icons-material/Spa';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleIcon from '@mui/icons-material/Article';
import LogoutIcon from '@mui/icons-material/Logout';
import CollectionsIcon from '@mui/icons-material/Collections';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';

const adminTheme = createTheme({
  palette: {
    primary: { main: '#696CFF' }, // Sneat Purple/Blue
    secondary: { main: '#8592A3' }, 
    background: { default: '#F5F5F9', paper: '#FFFFFF' },
    text: { primary: '#566A7F', secondary: '#a1acb8' }
  },
  typography: {
    fontFamily: 'var(--font-poppins)',
    button: { textTransform: 'none' }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#696CFF',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#696CFF',
            borderRadius: '4px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: 'none',
          boxShadow: '0 0.125rem 0.25rem rgba(161, 172, 184, 0.15)',
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 0.125rem 0.25rem rgba(161, 172, 184, 0.15)',
          color: '#566A7F'
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          margin: '0.25rem 1rem',
          padding: '0.5rem 1rem',
          width: 'calc(100% - 2rem)',
          transition: 'all 0.2s ease-in-out',
          '&.Mui-selected': {
            backgroundColor: 'rgba(105, 108, 255, 0.16) !important',
            color: '#696CFF',
            '&:hover': {
              backgroundColor: 'rgba(105, 108, 255, 0.24) !important',
            }
          },
          '&:hover': {
            backgroundColor: 'rgba(67, 89, 113, 0.04)',
          }
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '2.5rem',
          color: 'inherit'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          boxShadow: '0 0.125rem 0.25rem rgba(161, 172, 184, 0.15)',
          border: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.375rem',
          boxShadow: '0 0.125rem 0.25rem rgba(105, 108, 255, 0.4)',
        },
        containedPrimary: {
          backgroundColor: '#696CFF !important',
          color: '#FFFFFF !important',
          '&:hover': { backgroundColor: '#5f61e6 !important' }
        },
        containedSecondary: {
          backgroundColor: '#696CFF !important',
          color: '#FFFFFF !important',
          '&:hover': { backgroundColor: '#5f61e6 !important' }
        }
      }
    },
    MuiTable: {
      defaultProps: {
        stickyHeader: true,
        size: 'small',
      }
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxHeight: 'calc(100vh - 180px)'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#696CFF !important',
          color: '#FFFFFF',
          fontWeight: 600,
        }
      }
    }
  }
});

const drawerWidth = 260;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Media', icon: <CollectionsIcon />, path: '/admin/media' },
  { text: 'Home Content', icon: <ArticleIcon />, path: '/admin/home-content' },
  { text: 'Donations', icon: <MonetizationOnIcon />, path: '/admin/donations' },
  { text: 'Donation Types', icon: <ReceiptIcon />, path: '/admin/donation-types' },
  { text: 'Sevas', icon: <EventNoteIcon />, path: '/admin/sevas' },
  { text: 'Events', icon: <EventIcon />, path: '/admin/events' },
  { text: 'Pilgrims', icon: <PeopleIcon />, path: '/admin/pilgrims' },
  { text: 'CMS Pages', icon: <DescriptionIcon />, path: '/admin/cms' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    router.push('/login');
  };

  const drawerContent = (
    <>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Box component="img" src="/temple_logo.jpg" alt="Logo" sx={{ height: 40, width: 40, borderRadius: '50%', mr: 2, objectFit: 'cover' }} />
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#696CFF', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
          Admin<br/>Portal
        </Typography>
      </Box>
      <Box sx={{ overflow: 'auto', mt: 1 }}>
        <List dense>
          {menuItems.map((item) => (
            <ListItem 
              button 
              component={Link} 
              href={item.path} 
              key={item.text}
              selected={pathname === item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                color: pathname === item.path ? '#696CFF' : 'text.primary',
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ '& .MuiTypography-root': { fontWeight: pathname === item.path ? 600 : 400 } }} 
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={adminTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { sm: '100%', md: `calc(100% - ${drawerWidth}px - 48px)` }, 
            ml: { sm: 0, md: `${drawerWidth}px` },
            mt: { xs: 0, sm: 0, md: 2 },
            mr: { xs: 0, sm: 0, md: 3 },
            borderRadius: { xs: 0, sm: 0, md: 2 },
            left: { xs: 0, sm: 0, md: 'auto' },
            right: { xs: 0, sm: 0, md: 'auto' }
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ color: '#696CFF', fontWeight: 600, letterSpacing: '-0.5px', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Sri Varaha Venkatadri Devasthanam
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        </Box>
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, pt: { xs: 10, md: 12 }, height: '100vh', overflow: 'auto', width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` } }}>
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
