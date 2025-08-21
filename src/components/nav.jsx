import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Link as MuiLink, Drawer, IconButton, List, ListItem, ListItemText, Divider } from '@mui/material';
import { GithubOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import { Link } from 'react-router';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Features', href: '#features' },
    { text: 'API Docs', href: 'https://api.shortmesh.com/tutorials', external: true },
    { text: 'Self-Host', href: '#self-host' },
    { text: 'Pricing', href: '#pricing' }
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1300,
        px: { xs: 2, sm: 4, md: 6 },
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.75)' : 'transparent',
        transition: 'all 0.3s ease-in-out',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'none'
      }}
    >
      {/* Logo + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src="/logo.svg" alt="Logo" sx={{ width: 35, mr: 1 }} />
        <Typography component="a" href="/" variant="h5" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
          ShortMesh
        </Typography>
      </Box>

      {/* Middle Links */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, ml: 18 }}>
        <a href="#features" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>
          Features
        </a>
        <a
          href="https://api.shortmesh.com/tutorials"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}
        >
          API Docs
        </a>
        <a href="#self-host" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>
          Self-Host
        </a>
        <a href="#pricing" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 500 }}>
          Pricing
        </a>
      </Box>

      {/* Right Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Desktop Buttons */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <AnimateButton>
            <Button
              component="a"
              href="/dashboard"
              target="_blank"
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: 7,
                px: 4
              }}
            >
              Get Started
            </Button>
          </AnimateButton>
          <AnimateButton>
            <Button
              component="a"
              href="https://github.com/shortmesh"
              target="_blank"
              variant="outlined"
              startIcon={<GithubOutlined />}
              sx={{
                textTransform: 'none',
                borderRadius: 7,
                px: 3
              }}
            >
              GitHub
            </Button>
          </AnimateButton>
        </Box>

        {/* Mobile Menu Button */}
        <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
          <MenuOutlined />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 }
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Drawer Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="img" src="/logo.svg" alt="Logo" sx={{ width: 30, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ShortMesh
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerToggle}>
              <CloseOutlined />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Menu Items */}
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} sx={{ px: 0 }}>
                <Button
                  component="a"
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  fullWidth
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5,
                    color: 'text.primary',
                    fontWeight: 500
                  }}
                  onClick={handleDrawerToggle}
                >
                  {item.text}
                </Button>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Mobile Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              component="a"
              href="/dashboard"
              target="_blank"
              variant="contained"
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: 7,
                py: 1.5
              }}
              onClick={handleDrawerToggle}
            >
              Get Started
            </Button>
            <Button
              component="a"
              href="https://github.com/shortmesh"
              target="_blank"
              variant="outlined"
              fullWidth
              startIcon={<GithubOutlined />}
              sx={{
                textTransform: 'none',
                borderRadius: 7,
                py: 1.5
              }}
              onClick={handleDrawerToggle}
            >
              GitHub
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Nav;
