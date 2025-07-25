import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import { Link } from 'react-router';

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <Box component="img" src="/logo.svg" alt="Logo" sx={{ width: 30, mr: 1 }} />
        <Typography component="a" href="/" variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>
          ShortMesh
        </Typography>
      </Box>

      {/* Middle Links */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
        <a
          href="https://api.shortmesh.com/tutorials"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Docs
        </a>
        {/* <a href="/pricing" style={{ textDecoration: 'none', color: 'inherit' }}>
          Pricing
        </a> */}
      </Box>

      {/* Right Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            Login
          </Button>
        </AnimateButton>
        <a href="https://github.com/shortmesh" target="_blank" rel="noopener noreferrer">
          <GithubOutlined style={{ fontSize: 24, color: '#000' }} />
        </a>
      </Box>
    </Box>
  );
};

export default Nav;
