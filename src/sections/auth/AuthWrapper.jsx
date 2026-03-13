import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Grid, width } from '@mui/system';

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

// Dot-grid SVG rendered as a background pattern
function DotGrid() {
  return (
    <Box
      component="svg"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      sx={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }}
    >
      <defs>
        <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="white" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </Box>
  );
}

export default function AuthWrapper({ children }) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f6fa' }}>
      {/* ── Right form panel ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 2, sm: 4, md: 6, lg: 10 },
          py: 6,
          bgcolor: '#fff',
          overflowY: 'auto'
        }}
      >
        {/* Mobile logo */}
        {!isMd && (
          <Box
            component="img"
            src="/logo.svg"
            alt="ShortMesh"
            sx={{ width: 45, mb: 4, justifyContent: 'flex-start', display: 'flex', alignSelf: 'flex-start' }}
          />
        )}

        <Box sx={{ width: '100%', maxWidth: 440 }}>{children}</Box>
      </Box>
      {/* ── Left branding panel ── */}
      {isMd && (
        <Box
          sx={{
            position: 'relative',
            width: { md: '45%', lg: '42%' },
            flexShrink: 0,
            background: 'linear-gradient(145deg, #0d0f3b 0%, #161950 55%, #0d0f2e 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 6,
            py: 8,
            overflow: 'hidden'
          }}
        >
          {/* <DotGrid /> */}

          {/* Grid image centered in panel */}
          <Box
            component="img"
            src="/grid.svg"
            alt=""
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              // transform: 'translate(-50%, -40%)',
              width: '60%',
              opacity: 0.35,
              filter: 'brightness(0) invert(1)',
              zIndex: 0,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />
          <Box
            component="img"
            src="/grid.svg"
            alt=""
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-90%, -40%)',
              width: '60%',
              opacity: 0.35,
              filter: 'brightness(0) invert(1)',
              zIndex: 0,
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />

          {/* Content */}
          <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            {/* Logo */}
            {/* <Box
              component="img"
              src="/full-logo.svg"
              alt="ShortMesh"
              sx={{ width: 180, mb: 4, filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            /> */}
            <Grid container justifyContent="center" alignItems="center" sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <Box
                  component="img"
                  src="/logo.svg"
                  alt="ShortMesh"
                  sx={{ width: '45px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h3" sx={{ fontWeight: 600, color: '#fff', ml: 1, mt: 0.5 }}>
                  ShortMesh
                </Typography>
              </Grid>
            </Grid>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', maxWidth: 360, mx: 'auto', lineHeight: 1.75 }}>
              ShortMesh lets you send messages across different platforms via a unified API connected to your existing phone accounts.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

AuthWrapper.propTypes = { children: PropTypes.node };
